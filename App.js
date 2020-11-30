import React, { Context } from 'react';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import StationScreen from "./src/screens/StationsScreen";
import SearchScreen from "./src/screens/SearchScreen";
import {StationsStore, SearchStore, UiStore} from "./src/stores"

const Tab = createBottomTabNavigator();

const stationsStore = new StationsStore()
const searchStore = new SearchStore()
const uiStore = new UiStore()
const stores = {stationsStore, searchStore, uiStore}

const App = () => {
    return (
        <SafeAreaView style={styles.container}>
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen name="Stations">
                        {props => <StationScreen {...props} stores={{...stores}}/>}
                    </Tab.Screen>
                    <Tab.Screen name="Search">
                        {props => <SearchScreen {...props} stores={{...stores}}/>}
                    </Tab.Screen>
                </Tab.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default App