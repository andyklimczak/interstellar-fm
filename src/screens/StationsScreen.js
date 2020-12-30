import React, {useContext} from 'react';
import {Text, View, StyleSheet, FlatList,} from 'react-native';
import {observer} from "mobx-react";
import StationsList from "../components/StationsList";
import {RootStoreContext} from "../../App";
import {Header} from "react-native-elements";
import PlayingInfo from "../components/PlayingInfo";

const StationScreen = observer(() => {
    const stores = useContext(RootStoreContext)
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Header
                    centerComponent={{text: 'Stations', style: {color: '#fff'}}}
                    barStyle={"light-content"}
                />
                <StationsList stations={stores.stationsStore.stations}/>
            </View>
            <View>
                <PlayingInfo/>
            </View>
        </View>
    );
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // maybe flex-start
        alignItems: 'stretch',
    },
    innerContainer: {
        flex: 1,
    }
});

export default StationScreen