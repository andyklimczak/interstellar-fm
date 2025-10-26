import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioStatus,
} from 'expo-audio';
import { Alert } from 'react-native';

import { registerStationClick } from '@/lib/radio-browser';
import { Station } from '@/types/radio';

const STORAGE_KEY = '@interstellar-fm/saved-stations';
const RECENT_STORAGE_KEY = '@interstellar-fm/recent-stations';
const RECENT_STATION_LIMIT = 30;

type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused';

interface RadioContextValue {
  currentStation: Station | null;
  savedStations: Station[];
  recentStations: Station[];
  isHydrated: boolean;
  status: PlaybackStatus;
  volume: number;
  playStation: (station: Station) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  stop: () => Promise<void>;
  setVolume: (value: number) => Promise<void>;
  saveStation: (station: Station) => Promise<void>;
  removeStation: (stationuuid: string) => Promise<void>;
  isStationSaved: (stationuuid: string) => boolean;
  isBusy: boolean;
}

const RadioContext = createContext<RadioContextValue | undefined>(undefined);

const loadSavedStations = async (): Promise<Station[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as Station[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to load saved stations', error);
    return [];
  }
};

const persistStations = async (stations: Station[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stations));
  } catch (error) {
    console.warn('Failed to persist stations', error);
  }
};

const loadRecentStations = async (): Promise<Station[]> => {
  try {
    const raw = await AsyncStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as Station[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to load recent stations', error);
    return [];
  }
};

const persistRecentStations = async (stations: Station[]) => {
  try {
    await AsyncStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(stations));
  } catch (error) {
    console.warn('Failed to persist recent stations', error);
  }
};

const configureAudio = async () => {
  try {
    await setAudioModeAsync({
      allowsRecording: false,
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      shouldRouteThroughEarpiece: false,
      interruptionMode: 'doNotMix',
      interruptionModeAndroid: 'doNotMix',
    });
  } catch (error) {
    console.warn('Failed to configure audio mode', error);
  }
};

export const RadioProvider = ({ children }: PropsWithChildren) => {
  const playerRef = useRef<AudioPlayer | null>(null);
  const playerSubscriptionRef = useRef<{ remove: () => void } | null>(null);
  const [savedStations, setSavedStations] = useState<Station[]>([]);
  const [recentStations, setRecentStations] = useState<Station[]>([]);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [isBusy, setIsBusy] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [isHydrated, setIsHydrated] = useState(false);

  const detachPlayer = useCallback(() => {
    playerSubscriptionRef.current?.remove?.();
    playerSubscriptionRef.current = null;
    if (playerRef.current) {
      try {
        playerRef.current.pause();
      } catch {
        // ignored
      }
      try {
        playerRef.current.remove();
      } catch {
        // ignored
      }
      playerRef.current = null;
    }
  }, []);

  const handleStatusUpdate = useCallback((playbackStatus: AudioStatus) => {
    if (!playbackStatus.isLoaded) {
      setStatus('loading');
      return;
    }

    if (playbackStatus.playing) {
      setStatus('playing');
      return;
    }

    if (playbackStatus.didJustFinish) {
      setStatus('paused');
      return;
    }

    setStatus(playbackStatus.playing ? 'playing' : 'paused');
  }, []);

  const attachStatusListener = useCallback(
    (player: AudioPlayer) => {
      playerSubscriptionRef.current?.remove?.();
      const subscription = player.addListener('playbackStatusUpdate', handleStatusUpdate);
      playerSubscriptionRef.current = subscription;
    },
    [handleStatusUpdate],
  );

  useEffect(() => {
    void configureAudio();

    let isCancelled = false;
    const hydrate = async () => {
      try {
        const [saved, recent] = await Promise.all([loadSavedStations(), loadRecentStations()]);
        if (!isCancelled) {
          setSavedStations(saved);
          setRecentStations(recent);
        }
      } finally {
        if (!isCancelled) {
          setIsHydrated(true);
        }
      }
    };

    hydrate();

    return () => {
      isCancelled = true;
      detachPlayer();
      setStatus('idle');
    };
  }, [detachPlayer]);

  const recordRecentStation = useCallback((station: Station) => {
    setRecentStations((prev) => {
      const next = [station, ...prev.filter((item) => item.stationuuid !== station.stationuuid)];
      const limited = next.slice(0, RECENT_STATION_LIMIT);
      void persistRecentStations(limited);
      return limited;
    });
  }, []);

  const playStation = useCallback(
    async (station: Station) => {
      if (!station.urlResolved) {
        Alert.alert('Unavailable stream', 'This station does not have a playable stream URL.');
        return;
      }

      if (station.stationuuid === currentStation?.stationuuid && playerRef.current) {
        try {
          setIsBusy(true);
          playerRef.current.play();
          setStatus('playing');
        } catch (error) {
          Alert.alert('Playback failed', 'Unable to resume this station.');
          console.warn('Failed to resume playback', error);
        } finally {
          setIsBusy(false);
        }
        void registerStationClick(station.stationuuid);
        recordRecentStation(station);
        return;
      }

      setIsBusy(true);
      setStatus('loading');

      try {
        detachPlayer();
        const player = createAudioPlayer({ uri: station.urlResolved }, { updateInterval: 500 });
        player.volume = volume;
        attachStatusListener(player);
        playerRef.current = player;
        setCurrentStation(station);
        player.play();
        void registerStationClick(station.stationuuid);
        recordRecentStation(station);
      } catch (error) {
        console.error('Failed to start playback', error);
        Alert.alert('Playback failed', 'Unable to start this stream right now.');
        setCurrentStation(null);
        setStatus('idle');
        detachPlayer();
      } finally {
        setIsBusy(false);
      }
    },
    [attachStatusListener, currentStation?.stationuuid, detachPlayer, recordRecentStation, volume],
  );

  const togglePlayPause = useCallback(async () => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    try {
      setIsBusy(true);
      const playbackStatus = player.currentStatus;
      if (!playbackStatus.isLoaded) {
        setStatus('loading');
        player.play();
        return;
      }

      if (playbackStatus.playing) {
        player.pause();
        setStatus('paused');
      } else {
        player.play();
        setStatus('playing');
      }
    } catch (error) {
      console.warn('Failed to toggle playback', error);
    } finally {
      setIsBusy(false);
    }
  }, []);

  const stop = useCallback(async () => {
    const player = playerRef.current;
    if (!player) {
      return;
    }

    try {
      setIsBusy(true);
      player.pause();
      setStatus('paused');
    } catch (error) {
      console.warn('Failed to stop playback', error);
    } finally {
      setIsBusy(false);
    }
  }, []);

  const setVolume = useCallback(
    async (value: number) => {
      const nextVolume = Math.min(1, Math.max(0, value));
      setVolumeState(nextVolume);

      if (playerRef.current) {
        try {
          playerRef.current.volume = nextVolume;
        } catch (error) {
          console.warn('Failed to adjust volume', error);
        }
      }
    },
    [],
  );

  const saveStation = useCallback(
    async (station: Station) => {
      setSavedStations((prev) => {
        const exists = prev.some((item) => item.stationuuid === station.stationuuid);
        if (exists) {
          return prev;
        }
        const next = [...prev, station];
        persistStations(next);
        return next;
      });
    },
    [],
  );

  const removeStation = useCallback(async (stationuuid: string) => {
    setSavedStations((prev) => {
      const next = prev.filter((item) => item.stationuuid !== stationuuid);
      persistStations(next);
      return next;
    });
  }, []);

  const isStationSaved = useCallback(
    (stationuuid: string) => savedStations.some((station) => station.stationuuid === stationuuid),
    [savedStations],
  );

  const contextValue = useMemo<RadioContextValue>(
    () => ({
      currentStation,
      savedStations,
      recentStations,
      isHydrated,
      status,
      volume,
      playStation,
      togglePlayPause,
      stop,
      setVolume,
      saveStation,
      removeStation,
      isStationSaved,
      isBusy,
    }),
    [
      currentStation,
      savedStations,
      recentStations,
      isHydrated,
      status,
      volume,
      playStation,
      togglePlayPause,
      stop,
      setVolume,
      saveStation,
      removeStation,
      isStationSaved,
      isBusy,
    ],
  );

  return <RadioContext.Provider value={contextValue}>{children}</RadioContext.Provider>;
};

export const useRadio = () => {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error('useRadio must be used within a RadioProvider');
  }
  return context;
};

export { RadioContext };
