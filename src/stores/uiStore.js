import { makeAutoObservable } from "mobx"

export default class UiStore {
    loading = false

    constructor() {
        makeAutoObservable(this)
    }
}