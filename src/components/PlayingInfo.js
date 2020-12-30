import React, {useContext} from 'react';
import {Text, View, StyleSheet, FlatList, Button,} from 'react-native';
import {observer} from "mobx-react";
import {FontAwesome} from '@expo/vector-icons';
import {Icon} from 'react-native-elements'

import {RootStoreContext} from "../../App";

const PlayingInfo = observer(() => {
    const stores = useContext(RootStoreContext)
    const handleStopRadio = () => {
        console.log('handle stop radio')
        stores.radioStore.stopStation()
    }
    const currentStation = stores.radioStore.playingStation
    if (!currentStation) {
        return null
    }
    return (
        <View style={styles.container}>
            <Text style={styles.stationName}>
                {currentStation.name}
            </Text>
            <FontAwesome
                name={'stop-circle'}
                onPress={handleStopRadio}
                size={36}
            />
        </View>
    );
})

const styles = StyleSheet.create({
    container: {
        height: 50,
        backgroundColor: 'powderblue',
        flexDirection: 'row',
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // alignContent: 'space-around',
    },
    stationName: {
        marginRight: 15,
    }
});

export default PlayingInfo
