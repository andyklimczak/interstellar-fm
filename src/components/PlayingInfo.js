import React, {useContext, useState, useCallback} from 'react';
import {Text, View, StyleSheet, FlatList, Platform} from 'react-native';
import {observer} from "mobx-react";
import {FontAwesome} from '@expo/vector-icons';
import {Slider} from 'react-native-elements'
import debounce from 'lodash/debounce'

import {RootStoreContext} from "../../App";

const PlayingInfo = observer(() => {
    const stores = useContext(RootStoreContext)
    const [volume, setVolume] = useState(stores.radioStore.volume)
    const handleStopRadio = () => {
        console.log('handle stop radio')
        stores.radioStore.stopStation()
    }
    const handleVolumeChange = useCallback(debounce(vol => {
        setVolume(vol)
        stores.radioStore.setVolume(vol)
    }, 250), [])
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
            {Platform.OS === 'web' ? (
                <View style={styles.slider}>
                    <Slider
                        value={volume}
                        onValueChange={handleVolumeChange}
                        allowTouchTrack={true}
                        thumbStyle={{
                            height: 20,
                            width: 20,
                        }}
                        thumbTouchSize={{
                            height: 20,
                            width: 20,
                        }}
                        thumbTintColor='#674AB3'
                    />
                </View>
            ) : null}
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
        // alignContent: 'space-between',
    },
    stationName: {
        marginRight: 15,
    },
    slider: {
        width: 200,
        marginLeft: 50,
    },
});

export default PlayingInfo
