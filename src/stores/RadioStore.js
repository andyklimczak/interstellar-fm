import {makeAutoObservable, runInAction} from "mobx"
import {Audio} from 'expo-av';

import RadioBrowser from "../RadioBrowser";

export default class RadioStore {
    playingStation = null
    radio = null
    rootStore

    constructor(rootStore) {
        makeAutoObservable(this)
        this.rootStore = rootStore
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
            playThroughEarpieceAndroid: true
        });
    }

    async playStation(station) {
        console.log('playStation', station.name)
        if (this.playingStation != null) {
            try {
                await this.stopStation()
            } catch (error) {
                console.log('error stopping');
            }
        }

        try {
            const {sound, status} = await Audio.Sound.createAsync(
                {uri: station.url},
                {shouldPlay: true}
            );
            runInAction(() => {
                this.radio = sound
                this.playingStation = station
            })
            RadioBrowser.clickStation(station.stationuuid)
            console.log('playing', status, this.radio, this.playingStation)
        } catch (error) {
            // An error occurred!
            console.log('error')
            console.log(error)
        }


    }

    async stopStation() {
        try {
            if (this.radio) {
                await this.radio.stopAsync()
            }
        } catch (e) {
            console.log('error stopping station', e)
        }
        runInAction(() => {
            this.playingStation = null
        })
    }
}