import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { StationListItem } from '@/components/radio/StationListItem';
import { useRadio } from '@/contexts/radio-context';
import { Station } from '@/types/radio';

export const RecentStationsTab = () => {
  const { colors } = useTheme();
  const {
    recentStations,
    playStation,
    currentStation,
    saveStation,
    removeStation,
    isStationSaved,
    isHydrated,
  } = useRadio();

  if (!isHydrated) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading history…</Text>
      </View>
    );
  }

  const handleToggleSave = async (station: Station) => {
    if (isStationSaved(station.stationuuid)) {
      await removeStation(station.stationuuid);
    } else {
      await saveStation(station);
    }
  };

  return (
    <FlatList
      data={recentStations}
      keyExtractor={(item) => item.stationuuid}
      contentContainerStyle={
        recentStations.length === 0 ? styles.emptyContainer : styles.listContentContainer
      }
      renderItem={({ item }) => (
        <StationListItem
          station={item}
          onPlay={() => playStation(item)}
          onToggleSave={() => handleToggleSave(item)}
          isSaved={isStationSaved(item.stationuuid)}
          isActive={currentStation?.stationuuid === item.stationuuid}
        />
      )}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No stations yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.text }]}>
            Play something from Search or Saved and it will show up here.
          </Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 32,
  },
  loadingText: {
    fontSize: 14,
    opacity: 0.8,
  },
  listContentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyState: {
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtitle: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7,
  },
});
