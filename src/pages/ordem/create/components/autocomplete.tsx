import GooglePlacesAutocomplete from "react-google-places-autocomplete"
import { GeocoderAsync } from "../../../../services/servicesApi"
import ILocation from "../../../../interfaces/location"


interface AutocompleteOrdemProps {
    value: any,
    local: any,
    setLocal: (value: any) => void,
    setGeocode: (value: React.SetStateAction<ILocation>) => void
}

const AutocompleteOrdem: React.FC<AutocompleteOrdemProps> = ({
    value,
    local,
    setLocal,
    setGeocode
}) => {
    // Coordenadas do Rio de Janeiro
    const rioLatLng = new google.maps.LatLng(-22.908333, -43.196388)

    return (
        <div className="flex grid-cols-1 items-center justify-center">
            <div className="w-full mx-8">
                <label htmlFor="segmento">Buscar local</label>
                <GooglePlacesAutocomplete
                    apiKey="AIzaSyD74xxDFGvmO9DAGJW9pDI51J8fCQPaYDY"

                    autocompletionRequest={{
                        componentRestrictions: { country: "br" },
                        location: { lat: rioLatLng.lat(), lng: rioLatLng.lng() },
                        radius: 90 * 1000, // 100km em metros
                    }}

                    selectProps={{
                        value: value === null ? "" : value,
                        onChange: (item: any) => {

                            if (local) {
                                setLocal(`${local} - (${item.label})`)
                            } else {
                                setLocal(`(${item.label})`)
                            }

                            GeocoderAsync(item.label)
                                .then(coordenadas => {
                                    setGeocode(coordenadas)
                                })
                        },
                    }}
                />
            </div>
        </div>

    )
}

export default AutocompleteOrdem