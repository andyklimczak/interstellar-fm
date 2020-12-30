import {makeAutoObservable} from "mobx"
import RadioBrowser from "../RadioBrowser";

export default class SearchStore {
    query = ''
    searching = false
    results = []
    rootStore

    constructor(rootStore) {
        makeAutoObservable(this)
        this.rootStore
        this.initSearch()
    }

    async initSearch() {
        const filter = {
            limit: 25,
            order: 'clicktrend',
            hideBroken: true,
        }
        const response = await RadioBrowser.getAllStations(filter)
        this.results = response
    }

    async handleSearch(query) {
        this.query = query
        if (query.length > 0) {
            this.searching = true
            console.log('handle search', query)
            const filter = {
                limit: 25,
                by: 'tag',
                searchterm: query,
                order: 'clickcount',
                hideBroken: true,
            }
            // const response = await RadioBrowser.getStations(filter)
            const response = await RadioBrowser.getStations(query, filter)
            this.results = response
            console.log(query, response)
            this.searching = false
        }
    }
}