import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRadio } from '@/contexts/radio-context';

export const BottomPlayer = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { currentStation, status, playbackError, togglePlayPause, volume, setVolume, isBusy, stop } = useRadio();

  if (!currentStation) {
    return playbackError ? (
      <Text accessibilityRole="alert" style={[styles.error, { color: colors.text }]}>{playbackError}</Text>
    ) : null;
  }

  const isPlaying = status === 'playing';
  const colorAccent = colors.primary;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}>
      {playbackError && (
        <Text accessibilityRole="alert" style={[styles.error, { color: colors.text }]}>{playbackError}</Text>
      )}
      <View style={styles.headerRow}>
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {currentStation.name}
          </Text>
          {!!currentStation.country && (
            <Text style={[styles.subtitle, { color: colors.text }]} numberOfLines={1}>
              {currentStation.country}
            </Text>
          )}
        </View>
        <View style={styles.controls}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Stop playback"
            style={[styles.roundButton, { borderColor: colorAccent }]}
            onPress={stop}
            disabled={isBusy}>
            <Ionicons name="stop" size={18} color={colorAccent} />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Pause playback' : 'Play stream'}
            style={[styles.roundButtonFilled, { backgroundColor: colorAccent }]}
            onPress={togglePlayPause}
            disabled={isBusy}>
            {isBusy || status === 'loading' ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.sliderRow}>
        <Ionicons name="volume-low" size={18} color={colors.text} />
        <Slider
          accessibilityLabel="Volume"
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={setVolume}
          minimumTrackTintColor={colorAccent}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colorAccent}
        />
        <Ionicons name="volume-high" size={18} color={colors.text} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  error: {
    padding: 12,
    fontSize: 14,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  roundButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundButtonFilled: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  slider: {
    flex: 1,
    height: 30,
  },
});
