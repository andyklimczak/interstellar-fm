import { useSegments } from 'expo-router';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomPlayer } from '@/components/radio/BottomPlayer';
import { useRadio } from '@/contexts/radio-context';

const tabs = [
  { name: 'saved', title: 'Saved', href: '/saved' },
  { name: 'recent', title: 'Recent', href: '/recent' },
  { name: 'search', title: 'Search', href: '/search' },
] as const;

export default function TabLayout() {
  const { colors } = useTheme();
  const segments = useSegments();
  const { isHydrated } = useRadio();

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {isHydrated ? (
        <View style={styles.container}>
          <Tabs style={styles.container}>
            <TabList style={styles.tabList} accessibilityRole="tablist">
              {tabs.map(({ name, title, href }) => {
                const selected = segments.at(-1) === name;
                return (
                  <TabTrigger
                    key={name}
                    name={name}
                    href={href}
                    accessibilityRole="tab"
                    accessibilityLabel={title}
                    aria-selected={selected}
                    style={[styles.tab, { borderBottomColor: selected ? colors.primary : 'transparent' }]}
                  >
                    <Text style={[styles.label, { color: selected ? colors.text : `${colors.text}99` }]}>
                      {title}
                    </Text>
                  </TabTrigger>
                );
              })}
            </TabList>
            <TabSlot style={styles.container} />
          </Tabs>
          <BottomPlayer />
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabList: { flexDirection: 'row' },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 3 },
  label: { fontSize: 16, fontWeight: '600' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
