declare module 'expo-audio' {
  export type AudioMetadata = {
    title?: string;
    artist?: string;
    albumTitle?: string;
    artworkUrl?: string;
  };

  export type AudioLockScreenOptions = {
    showSeekBackward?: boolean;
    showSeekForward?: boolean;
  };

  interface AudioPlayer {
    /**
     * Toggles this player as the active instance that powers iOS/Android
     * lock-screen controls. When enabling, metadata and optional control
     * visibility can be provided.
     */
    setActiveForLockScreen?: (
      active: boolean,
      metadata?: AudioMetadata,
      options?: AudioLockScreenOptions,
    ) => void;

    /**
     * Refreshes the metadata that is displayed on the system lock screen.
     */
    updateLockScreenMetadata?: (metadata: AudioMetadata) => void;

    /**
     * Clears control-center / lock-screen state for this player.
     */
    clearLockScreenControls?: () => void;
  }
}
