import GooglePlacesAutocomplete from "react-google-places-autocomplete"
import ILocation from "../../../interfaces/location"
import { GeocoderAsync } from "../../../services/servicesApi"
import { useContext } from "react"
import { sisfirContext } from "../../../context/sisfircontext"


interface AutocompleteOrdemProps {
}

export const AutocompleteComponent: React.FC<AutocompleteOrdemProps> = ({

}) => {

    const rioLatLng = new google.maps.LatLng(-22.908333, -43.196388)
    const { setOrdem, ordem, options } = useContext(sisfirContext)


    const handleLocal = (street: string): string => {
        if (street === 'ZONA OESTE - Guaratiba, Rio de Janeiro - RJ, Brasil') {
            street = 'ZONA OESTE - Barra, Recreio, Jacarepaguá e Várgens'
        }

        if (street === 'Santa Cruz, Rio de Janeiro - RJ, Brasil') {
            street = 'ZONA OESTE - Deodoro a Santa Cruz'
        }

        if (ordem?.local) {

            return `${ordem?.local} - (${street})`

        } else {

            return `(${street})`

        }
    }

    const handleChange = (geocode: any, street: string) => {
        if (ordem) {
            setOrdem({ ...ordem, geocode: geocode, local: handleLocal(street) })
        }
    }

    return (
        <div className="flex w-full grid-cols-1 items-center justify-center">
            <div className="w-full">
                <label htmlFor="segmento">Buscar local</label>
                <GooglePlacesAutocomplete
                    apiKey="AIzaSyD74xxDFGvmO9DAGJW9pDI51J8fCQPaYDY"

                    autocompletionRequest={{
                        componentRestrictions: { country: "br" },
                        location: { lat: rioLatLng.lat(), lng: rioLatLng.lng() },
                        radius: 90 * 1000, // 100km em metros
                    }}

                    selectProps={{

                        onChange: (item: any) => {
                            GeocoderAsync(item.label)
                                .then(coordenadas => {
                                    handleChange(coordenadas, item.label)
                                })
                        },
                    }}
                />
            </div>
        </div>
    )
}
