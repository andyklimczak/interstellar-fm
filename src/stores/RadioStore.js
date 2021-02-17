import {makeAutoObservable, runInAction} from "mobx"
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Audio} from 'expo-av';

import RadioBrowser from "../RadioBrowser";

const VOLUME_KEY = '@interstellarfm.volume'

export default class RadioStore {
    playingStation = null
    radio = null
    volume = .1
    rootStore

    constructor(rootStore) {
        makeAutoObservable(this)
        this.rootStore = rootStore
        this.setupAudio()
    }

    async setupAudio() {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
            playThroughEarpieceAndroid: true,
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
            const sound = new Audio.Sound()
            const source = {
                uri: station.url
                // uri: 'https://ia800204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act1_shakespeare.mp3'
            }
            const status = {
                shouldPlay: true,
                volume: this.volume,
            }
            await sound.loadAsync(source, status, false)
            // sound.setOnPlaybackStatusUpdate(status => {
            //     console.log('change in status', status)
            // })
            runInAction(() => {
                this.radio = sound
                this.playingStation = station
            })
            RadioBrowser.clickStation(station.stationuuid)
            console.log('playing', status, this.radio, this.playingStation)

        } catch (e) {
            console.log('error playing')
            console.log(e)
        }
    }

    async stopStation() {
        try {
            if (this.radio) {
                const { isLoaded } = await this.radio.getStatusAsync()
                console.log(await this.radio.getStatusAsync())
                if (isLoaded) {
                    await this.radio.unloadAsync()
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
        console.log('set vol', vol)
        if (this.radio) {
            const normalizedVolume = Math.pow(vol, 2)
            this.volume = normalizedVolume
            this.radio.setVolumeAsync(normalizedVolume)
        }
    }
}