import axios from 'axios'
import map from 'lodash/map'

export default {
    async getStations(query, filters) {
        const queryParams = map(filters, (value, key) => `${key}=${value}`).join('&')
        console.log('query params', queryParams)
        console.log(query, filters)
        const response = await axios.get(
            `https://de1.api.radio-browser.info/json/stations/bytag/${query}?${queryParams}`,
            {
                headers: {
                    'x-requested-with': 'InterstellarFM'
                }
            }
        )
        return response.data
    },
    async getAllStations(filters) {
        const queryParams = map(filters, (value, key) => `${key}=${value}`).join('&')
        const response = await axios.get(
            `https://de1.api.radio-browser.info/json/stations?${queryParams}`,
            {
                headers: {
                    'x-requested-with': 'InterstellarFM'
                }
            }
        )
        return response.data
    },
    async clickStation(stationuuid) {
        try {
            const response = await axios.get(
                `https://de1.api.radio-browser.info/json/url/${stationuuid}`,
                {
                    headers: {
                        'x-requested-with': 'InterstellarFM'
                    }
                }
            )
        } catch (e) {
            console.log('error clicking station', e)
        }

    },

    async voteStation(stationuuid) {
        try {
            const response = await axios.get(
                `https://de1.api.radio-browser.info/json/xml/${stationuuid}`,
                {
                    headers: {
                        'x-requested-with': 'InterstellarFM'
                    }
                }
            )
        } catch (e) {
            console.log('error voting station', e)
        }
    }
}