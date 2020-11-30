import React from 'react';
import { Text, View } from 'react-native';
import { observer } from "mobx-react";

const StationScreen = observer((props) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Stations!</Text>
            <Text>{props.stores.stationsStore.andy}</Text>
        </View>
    );
})

export default StationScreen