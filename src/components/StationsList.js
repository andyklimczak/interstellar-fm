import React from 'react';
import { Text, View, StyleSheet, FlatList, } from 'react-native';
import { observer, Observer } from "mobx-react";
import StationsListItem from "./StationsListItem";
import SearchListItem from "./SearchListItem";

const StationsList = observer(({stations, listType}) => {
    const ItemComponent = listType == 'search' ? SearchListItem : StationsListItem
    console.log('stations list stations', listType, stations.length)
    return (
        <Observer>
            {() => (
                <FlatList
                    data={stations}
                    keyExtractor={(item, index) => item.stationuuid}
                    renderItem={({item}) => <ItemComponent item={item}/>}
                />
            )}
        </Observer>
    );
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default StationsList
