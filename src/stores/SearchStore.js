import { makeAutoObservable } from "mobx"

export default class SearchStore {
    results = []
    query = null

    constructor() {
        makeAutoObservable(this)
    }
}