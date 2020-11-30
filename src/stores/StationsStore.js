import { makeAutoObservable } from "mobx"

export default class StationsStore {
    stations = [
        {
            "name": "Defcon - Somafm",
        },
        {
            "name": "Liquid DnB - Difm",
        },
        {
            "name": "Classic Music - Sacramento",
        },
    ]
    andy = 'andy store'

    constructor() {
        makeAutoObservable(this)
    }
}