import React, {useContext, Fragment, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {observer} from "mobx-react";
import {ListItem, Avatar, Text, Overlay, Button} from 'react-native-elements'
import {Modal} from 'react-native-web'
import isEqual from 'lodash/isEqual'

import {RootStoreContext} from "../../App";

const StationsListItem = observer(({item}) => {
    const stores = useContext(RootStoreContext)
    const [visible, setVisible] = useState(false)
    const toggleOverlay = () => {
        setVisible(!visible)
    }
    const handleDeleteStation = () => {
        stores.stationsStore.deleteStation(item)
    }
    const handleVoteStation = () => {
        stores.stationsStore.voteStation(item)
    }
    const handlePlayStation = () => {
        stores.radioStore.playStation(item)
    }
    const isPlayingStation = () => {
        return isEqual(stores.radioStore.playingStation, item)
    }
    return (
        <Fragment>
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
                <ListItem.Chevron
                    // onPress={toggleOverlay}
                    // name={'ellipsis-v'}
                    onPress={handleDeleteStation}
                    name={'minus'}
                    type={'font-awesome-5'}
                    size={24}
                />
            </ListItem>
            {/*<Overlay ModalComponent={Modal} isVisible={visible} onBackdropPress={toggleOverlay}>*/}
            {/*    <View>*/}
            {/*        <View style={styles.modalTitle}>*/}
            {/*            <Avatar*/}
            {/*                source={{uri: item.favicon}}*/}
            {/*                size={'medium'}*/}
            {/*                containerStyle={{marginRight: 10}}*/}
            {/*            />*/}
            {/*            <Text h4>{item.name}</Text>*/}
            {/*        </View>*/}
            {/*        <View>*/}
            {/*            <Button*/}
            {/*                style={styles.modalButton}*/}
            {/*                title={"Remove"}*/}
            {/*                onPress={handleDeleteStation}*/}
            {/*            />*/}
            {/*            <Button*/}
            {/*                style={styles.modalButton}*/}
            {/*                title={"Vote"}*/}
            {/*                onPress={handleVoteStation}*/}
            {/*            />*/}
            {/*        </View>*/}
            {/*    </View>*/}
            {/*</Overlay>*/}
        </Fragment>
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
        backgroundColor: 'rgba(0,175,225,.5)',
    },
    modalTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalButton: {
        marginBottom: 5,
    }
});

export default StationsListItem
