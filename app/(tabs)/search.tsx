import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { SearchStationsTab } from '@/components/radio/SearchStationsTab';
import { useRadio } from '@/contexts/radio-context';

export default function SearchScreen() {
  const { colors } = useTheme();
  const { isHydrated } = useRadio();

  if (!isHydrated) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  return <SearchStationsTab />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
