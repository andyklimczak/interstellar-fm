import React, {useContext} from 'react';
import {Text, View, StyleSheet, FlatList, Pressable} from 'react-native';
import {observer} from "mobx-react";
import {ListItem, Avatar} from 'react-native-elements'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'

import {RootStoreContext} from "../../App";
import map from 'lodash/map'

const SearchListItem = observer(({item}) => {
    const stores = useContext(RootStoreContext)
    const handlePlayStation = () => {
        stores.radioStore.playStation(item)
    }
    const handleAddStation = () => {
        stores.stationsStore.addStation(item)
    }
    const hasStation = (station) => {
        const uuids = map(stores.stationsStore.stations, 'stationuuid')
        return uuids.includes(station.stationuuid)
    }
    const isPlayingStation = () => {
        return isEqual(stores.radioStore.playingStation, item)
    }
    return (
        <ListItem
            bottomDivider
            onPress={handlePlayStation}
            containerStyle={[isPlayingStation() && styles.playing]}
        >
            <Avatar source={{uri: item.favicon}}/>
            <ListItem.Content style={styles.content}>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>{item.tags}</ListItem.Subtitle>
            </ListItem.Content>
            {hasStation(item) ? null :
                <ListItem.Chevron
                    style={styles.buttonGroup}
                    onPress={handleAddStation}
                    name={'plus'}
                    type={'font-awesome-5'}
                    size={24}
                />
            }
        </ListItem>
    );
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        // flex: 1,
        flexGrow: 60,
    },
    buttonGroup: {
        // flex: 1,
        flexGrow: 1,
    },
    playing: {
        backgroundColor:'rgba(0,175,225,.5)',
    }
});

export default SearchListItem
