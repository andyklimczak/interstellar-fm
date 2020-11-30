import { makeAutoObservable } from "mobx"

export default class StationsStore {
    stations = [
        {
            id: '1',
            name: "Defcon - Somafm",
        },
        {
            id: '2',
            name: "Liquid DnB - Difm",
        },
        {
            id: '3',
            name: "Classic Music - Sacramento",
        },
    ]
    andy = 'andy store'

    constructor() {
        makeAutoObservable(this)
    }
}