import axios, { AxiosRequestConfig } from "axios";
import { IGoogleAutocompleteRequest } from "./igoogleautocompleterequest";

export class AutocompleteRequest implements IGoogleAutocompleteRequest {

    async searchPlace(address: string): Promise<google.maps.LatLng> {

        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyD74xxDFGvmO9DAGJW9pDI51J8fCQPaYDY`

        const config: AxiosRequestConfig = {
            method: 'get',
            url
        }

        const response = await axios(config)
        const { status } = response

        if (status === 200) {
            const { results } = response.data
            const { geometry } = results[0]
            const { location } = geometry
            const { lat, lng } = location
            return new google.maps.LatLng(lat, lng)
        }

        return new google.maps.LatLng(0, 0)
    }

}