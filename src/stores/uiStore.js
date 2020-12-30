import { makeAutoObservable } from "mobx"

export default class UiStore {
    loading = false
    rootStore

    constructor(rootStore) {
        makeAutoObservable(this)
        this.rootStore = rootStore
    }
}