import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';

import { StationListItem } from '@/components/radio/StationListItem';
import { useRadio } from '@/contexts/radio-context';
import { fetchTopStations, searchStations, type SearchSortField } from '@/lib/radio-browser';
import { Station } from '@/types/radio';

const sortOptions: { label: string; value: SearchSortField }[] = [
  { label: 'Name', value: 'name' },
  { label: 'Clicks', value: 'clickcount' },
  { label: 'Trend', value: 'clicktrend' },
  { label: 'Votes', value: 'votes' },
  { label: 'Bitrate', value: 'bitrate' },
];

export const SearchStationsTab = () => {
  const { colors } = useTheme();
  const { playStation, currentStation, saveStation, removeStation, isStationSaved } = useRadio();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Station[]>([]);
  const [featuredStations, setFeaturedStations] = useState<Station[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredError, setFeaturedError] = useState<string | null>(null);
  const [searchOrder, setSearchOrder] = useState<SearchSortField>('name');
  const [browseOrder, setBrowseOrder] = useState<SearchSortField>('clickcount');

  const trimmedQuery = query.trim();
  const usingSearch = trimmedQuery.length >= 2;
  const sortOrder = usingSearch ? searchOrder : browseOrder;

  const changeSortOrder = (order: SearchSortField) => {
    if (order === sortOrder) return;
    if (usingSearch) {
      setSearchOrder(order);
      setResults([]);
      setError(null);
      setIsSearching(true);
    } else {
      setBrowseOrder(order);
      setFeaturedStations([]);
      setFeaturedError(null);
      setIsLoadingFeatured(true);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const loadFeatured = async () => {
      try {
        const stations = await fetchTopStations(30, browseOrder);
        if (!isCancelled) {
          setFeaturedStations(stations);
          setFeaturedError(null);
        }
      } catch (error) {
        console.warn('Failed to load featured stations', error);
        if (!isCancelled) {
          setFeaturedError('Unable to load stations right now.');
          setFeaturedStations([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingFeatured(false);
        }
      }
    };

    loadFeatured();

    return () => {
      isCancelled = true;
    };
  }, [browseOrder]);

  useEffect(() => {
    if (trimmedQuery.length < 2) {
      return;
    }

    let isCancelled = false;

    const timeout = setTimeout(async () => {
      try {
        const stations = await searchStations(trimmedQuery, { order: searchOrder });
        if (isCancelled) {
          return;
        }
        setResults(stations);
        setError(null);
      } catch (error) {
        if (isCancelled) {
          return;
        }
        console.warn('Radio Browser search failed', error);
        setError('Unable to reach Radio Browser right now. Try again in a moment.');
        setResults([]);
      } finally {
        if (!isCancelled) {
          setIsSearching(false);
        }
      }
    }, 350);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [trimmedQuery, searchOrder]);

  const handleToggleSave = async (station: Station) => {
    if (isStationSaved(station.stationuuid)) {
      await removeStation(station.stationuuid);
    } else {
      await saveStation(station);
    }
  };

  const dataSource = usingSearch ? results : featuredStations;

  const listEmptyComponent = usingSearch
    ? !isSearching
      ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No stations found</Text>
          <Text style={[styles.emptySubtitle, { color: colors.text }]}>
            Try a different name or artist.
          </Text>
        </View>
        )
      : null
    : !isLoadingFeatured
      ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Nothing to show yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.text }]}>
            Stations will appear here once we can reach Radio Browser.
          </Text>
        </View>
        )
      : null;

  const listHeaderComponent =
    !usingSearch && dataSource.length > 0 ? (
      <Text style={[styles.featuredTitle, { color: colors.text }]}>
        {browseOrder === 'clickcount' ? 'Popular right now' : 'Browse stations'}
      </Text>
    ) : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchRow, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Ionicons name="search" size={18} color={colors.text} />
        <TextInput
          placeholder="Search radio stations"
          placeholderTextColor={`${colors.text}66`}
          value={query}
          onChangeText={(value) => {
            setQuery(value);
            const nextQuery = value.trim();
            if (nextQuery !== trimmedQuery) {
              setResults([]);
              setError(null);
              setIsSearching(nextQuery.length >= 2);
            }
          }}
          style={[styles.input, { color: colors.text }]}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      <View style={styles.sortRow}>
        <Text style={[styles.sortLabel, { color: colors.text }]}>Sort by</Text>
        {sortOptions.map(({ label, value }) => {
          const isActive = sortOrder === value;
          return (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              {...(Platform.OS === 'web' ? { 'aria-pressed': isActive } : {})}
              onPress={() => changeSortOrder(value)}
              style={[
                styles.sortChip,
                {
                  backgroundColor: isActive ? colors.primary : colors.card,
                  borderColor: isActive ? colors.primary : colors.border,
                },
              ]}>
              <Text style={[styles.sortChipText, { color: isActive ? '#fff' : colors.text }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isSearching && usingSearch && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Searching…</Text>
        </View>
      )}

      {error && usingSearch && (
        <View style={styles.errorRow}>
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
        </View>
      )}

      {!usingSearch && isLoadingFeatured && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading stations…</Text>
        </View>
      )}

      {!usingSearch && featuredError && (
        <View style={styles.errorRow}>
          <Text style={[styles.errorText, { color: colors.text }]}>{featuredError}</Text>
        </View>
      )}

      <FlatList
        data={dataSource}
        keyExtractor={(item) => item.stationuuid}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          dataSource.length === 0 ? styles.emptyContainer : styles.listContentContainer
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
        ListEmptyComponent={listEmptyComponent ?? undefined}
        ListHeaderComponent={listHeaderComponent ?? undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchRow: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  sortRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  sortLabel: {
    fontSize: 14,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  sortChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  errorRow: {
    paddingVertical: 12,
  },
  errorText: {
    fontSize: 14,
  },
  listContentContainer: {
    paddingVertical: 16,
    paddingBottom: 120,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
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
  featuredTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
});
