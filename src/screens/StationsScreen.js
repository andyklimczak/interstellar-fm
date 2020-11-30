import React from 'react';
import { Text, View, StyleSheet, FlatList, } from 'react-native';
import { observer } from "mobx-react";

const StationScreen = observer((props) => {
    return (
        <View style={styles.container}>
            <Text>Stations!</Text>
            <Text>{props.stores.stationsStore.andy}</Text>
            <FlatList
                data={props.stores.stationsStore.stations}
                renderItem={({item}) => {
                    return <Text key={item.id}>{item.name}</Text>
                }}
            />
        </View>
    );
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default StationScreen