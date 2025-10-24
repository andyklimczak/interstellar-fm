import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { StationListItem } from '@/components/radio/StationListItem';
import { useRadio } from '@/contexts/radio-context';

export const SavedStationsTab = () => {
  const { colors } = useTheme();
  const { savedStations, playStation, currentStation, removeStation, isStationSaved, isHydrated } =
    useRadio();

  if (!isHydrated) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading saved stations…</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={savedStations}
      keyExtractor={(item) => item.stationuuid}
      contentContainerStyle={
        savedStations.length === 0 ? styles.emptyContainer : styles.listContentContainer
      }
      renderItem={({ item }) => (
        <StationListItem
          station={item}
          onPlay={() => playStation(item)}
          onToggleSave={() => removeStation(item.stationuuid)}
          isSaved={isStationSaved(item.stationuuid)}
          isActive={currentStation?.stationuuid === item.stationuuid}
        />
      )}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No saved stations yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.text }]}>
            Find something you like in the search tab and tap the heart to save it here.
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
