import React, {createContext, useContext} from 'react';
import {StyleSheet, SafeAreaView, View, useColorScheme, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors, ThemeProvider} from "react-native-elements";
import {MaterialCommunityIcons} from '@expo/vector-icons';

import StationScreen from "./src/screens/StationsScreen";
import SearchScreen from "./src/screens/SearchScreen";
import {StationsStore, SearchStore, UiStore, RadioStore} from "./src/stores"

const Tab = createBottomTabNavigator();

class RootStore {
    constructor() {
        this.stationsStore = new StationsStore(this)
        this.searchStore = new SearchStore(this)
        this.uiStore = new UiStore(this)
        this.radioStore = new RadioStore(this)
    }
}

export const RootStoreContext = createContext()

const componentTheme = {
    colors: {
        ...Platform.select({
            default: colors.platform.android,
            ios: colors.platform.ios,
        }),
    },
};

const App = () => {
    const colorScheme = useColorScheme();
    const useDark = colorScheme === 'dark'

    return (
        <RootStoreContext.Provider value={new RootStore()}>
            <ThemeProvider theme={componentTheme} useDark={useDark}>
                <NavigationContainer theme={useDark ? DarkTheme : DefaultTheme}>
                    <Tab.Navigator>
                        <Tab.Screen
                            name="Stations"
                            component={StationScreen}
                            options={{
                                tabBarIcon: ({color, size}) => (
                                    <MaterialCommunityIcons name="playlist-music" size={size} color={color}/>
                                )
                            }}
                        />
                        <Tab.Screen
                            name="Search"
                            component={SearchScreen}
                            options={{
                                tabBarIcon: ({color, size}) => (
                                    <MaterialCommunityIcons name="search-web" size={size} color={color}/>
                                )
                            }}
                        />
                    </Tab.Navigator>
                </NavigationContainer>
            </ThemeProvider>
        </RootStoreContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default App