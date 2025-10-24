import { withLayoutContext } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { BottomPlayer } from '@/components/radio/BottomPlayer';
import { useRadio } from '@/contexts/radio-context';

const { Navigator } = createMaterialTopTabNavigator();
const Tabs = withLayoutContext(Navigator);

export default function TabLayout() {
  const { colors } = useTheme();
  const { isHydrated } = useRadio();

  if (!isHydrated) {
    return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.container}>
        <View style={styles.tabsWrapper}>
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: colors.text,
              tabBarInactiveTintColor: `${colors.text}99`,
              tabBarIndicatorStyle: { backgroundColor: colors.primary, height: 3, borderRadius: 3 },
              tabBarStyle: {
                backgroundColor: 'transparent',
                elevation: 0,
                shadowOpacity: 0,
              },
              tabBarLabelStyle: {
                fontSize: 16,
                fontWeight: '600',
                textTransform: 'none',
              },
              tabBarPressColor: `${colors.primary}33`,
            }}
          >
            <Tabs.Screen name="saved" options={{ title: 'Saved' }} />
            <Tabs.Screen name="search" options={{ title: 'Search' }} />
          </Tabs>
        </View>
        <BottomPlayer />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  tabsWrapper: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
