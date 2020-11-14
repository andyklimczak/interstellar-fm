import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import StationScreen from "./src/screens/StationsScreen";
import SearchScreen from "./src/screens/SearchScreen";
import stores from "./src/stores"

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen name="Stations" component={StationScreen}/>
                    <Tab.Screen name="Search" component={SearchScreen}/>
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
