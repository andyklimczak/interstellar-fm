import {makeAutoObservable, runInAction} from "mobx"
import {Audio} from 'expo-av';

import RadioBrowser from "../RadioBrowser";

export default class RadioStore {
    playingStation = null
    radio = null
    volume = 1
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
                {
                    shouldPlay: true,
                    isLooping: false,
                    volume: this.volume,
                    progressUpdateIntervalMillis: 500,
                }
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
                const { isLoaded } = await this.radio.getStatusAsync()
                console.log(await this.radio.getStatusAsync())
                if (isLoaded) {
                    await this.radio.stopAsync()
                }
            }
        } catch (e) {
            console.log('error stopping station', e)
        }
        runInAction(() => {
            this.playingStation = null
        })
    }

    setVolume(vol) {
        console.log('set vol')
        if (this.radio) {
            this.volume = vol
            this.radio.setVolumeAsync(vol)
        }
    }
}