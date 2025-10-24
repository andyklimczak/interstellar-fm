import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useTheme } from '@react-navigation/native';
import { Station } from '@/types/radio';

interface Props {
  station: Station;
  onPlay: () => void;
  onToggleSave: () => void;
  isSaved: boolean;
  isActive: boolean;
}

const hasPlayableArtwork = (uri?: string | null) => {
  if (!uri) {
    return false;
  }

  try {
    const parsed = new URL(uri);
    return parsed.protocol.startsWith('http');
  } catch {
    return false;
  }
};

export const StationListItem = ({ station, onPlay, onToggleSave, isSaved, isActive }: Props) => {
  const { colors } = useTheme();
  const displayTags = useMemo(() => {
    if (!station.tags) {
      return null;
    }
    return station.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 3)
      .join(' · ');
  }, [station.tags]);

  const clickCountDisplay =
    typeof station.clickCount === 'number' && station.clickCount > 0
      ? `${station.clickCount.toLocaleString()} clicks`
      : null;
  const voteDisplay =
    typeof station.votes === 'number' && station.votes > 0
      ? `${station.votes.toLocaleString()} votes`
      : null;

  const subtitle = [
    station.country,
    station.language,
    station.bitrate ? `${station.bitrate} kbps` : null,
    clickCountDisplay,
    voteDisplay,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Pressable
      onPress={onPlay}
      style={({ pressed }) => [
        styles.container,
        { borderColor: isActive ? colors.primary : colors.border, backgroundColor: colors.card },
        pressed && styles.pressed,
      ]}>
      <View style={styles.artwork}>
        {hasPlayableArtwork(station.favicon) ? (
          <Image source={{ uri: station.favicon ?? undefined }} style={styles.artworkImage} />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: colors.border }]}>
            <Text style={[styles.placeholderText, { color: colors.text }]}>
              {station.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
          {station.name}
        </Text>
        {!!subtitle && (
          <Text numberOfLines={1} style={[styles.subtitle, { color: colors.text }]}>
            {subtitle}
          </Text>
        )}
        {!!displayTags && (
          <Text numberOfLines={1} style={[styles.tags, { color: colors.text }]}>
            {displayTags}
          </Text>
        )}
      </View>
      <View style={styles.actions}>
        {isActive && (
          <View style={styles.equalizer}>
            <Ionicons name="musical-notes" size={16} color={colors.primary} />
          </View>
        )}
        <Pressable onPress={onToggleSave} hitSlop={8} style={styles.iconButton}>
          <Ionicons
            name={isSaved ? 'heart' : 'heart-outline'}
            size={22}
            color={isSaved ? colors.primary : colors.text}
          />
        </Pressable>
        <Pressable onPress={onPlay} hitSlop={8} style={styles.iconButton}>
          <Ionicons
            name={isActive ? 'pause' : 'play'}
            size={22}
            color={isActive ? colors.primary : colors.text}
          />
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  artwork: {
    width: 56,
    height: 56,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f1f1f10',
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  tags: {
    fontSize: 12,
    opacity: 0.6,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconButton: {
    padding: 4,
  },
  equalizer: {
    marginRight: 4,
  },
});
