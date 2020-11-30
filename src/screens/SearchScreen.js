import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {observer} from "mobx-react";

const SearchScreen = observer((props) => {
    return (
        <View style={styles.container}>
            <Text>Search!</Text>
        </View>
    );
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default SearchScreen