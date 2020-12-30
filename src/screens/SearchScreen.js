import React, {useCallback, useState, useContext} from 'react';
import {Picker, View, StyleSheet} from 'react-native';
import {observer} from "mobx-react";
import debounce from 'lodash/debounce'
import {Header} from "react-native-elements";

import StationsList from "../components/StationsList";
import PlayingInfo from "../components/PlayingInfo";
import {SearchBar} from "react-native-elements";
import {RootStoreContext} from "../../App";

const SearchScreen = observer((props) => {
    const stores = useContext(RootStoreContext)
    const [query, setQuery] = useState(stores.searchStore.query)
    const handleSearch = useCallback(debounce(query => {
        stores.searchStore.handleSearch(query)
    }, 1000), [])
    const onChangeText = (query) => {
        setQuery(query)
        handleSearch(query)
    }
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Header
                    centerComponent={{text: 'Search', style: {color: '#fff'}}}
                />
                <SearchBar
                    placeholder={"Search"}
                    onChangeText={onChangeText}
                    value={query}
                    clearIcon={true}
                    showLoading={stores.searchStore.searching}
                    platform={'ios'}
                />
                <StationsList stations={stores.searchStore.results} listType={'search'}/>
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
        justifyContent: 'center', // maybe flex start
        alignItems: 'stretch',
    },
    innerContainer: {
        flex: 1,
    }
});

export default SearchScreen