import {makeAutoObservable, runInAction} from "mobx"
import AsyncStorage from '@react-native-async-storage/async-storage';
import map from 'lodash/map'
import RadioBrowser from "../RadioBrowser";

const STATIONS_KEY = '@interstellarfm.stations'

export default class StationsStore {
    stations = []
    andy = 'andy store'
    rootStore

    constructor(rootStore) {
        makeAutoObservable(this)
        this.rootStore = rootStore
        // this.fetchStations()
    }

    async fetchStations() {
        try {
            const stationsJson = await AsyncStorage.getItem(STATIONS_KEY)
            runInAction(() => {
                this.stations = stationsJson ? JSON.parse(stationsJson) : []
            })
        } catch (e) {
            console.log('error getting stations', e)
            runInAction(() => {
                this.stations = []
            })
        }
    }

    async saveStations() {
        console.log('save stations', this.stations.length)
        try {
            // await AsyncStorage.setItem(STATIONS_KEY, JSON.stringify(this.stations))
        } catch (e) {
            console.log('error saving stations')
        }
    }

    addStation(station) {
        console.log('add station', station)
        this.stations.push(station)
        this.saveStations()
    }

    deleteStation(station) {
        this.stations = this.stations.filter(item => item != station)
        this.saveStations()
    }

    voteStation(station) {
        RadioBrowser.voteStation(station.stationuuid)
    }
}