// geocode.ts
import { Loader } from '@googlemaps/js-api-loader';

interface AddressResult {
    address: string | null;
    error: string | null;
}

// Função AddressGeocode
/**
 * Obtém o endereço a partir das coordenadas geográficas (latitude e longitude) usando a API do Google Maps.
 *
 * @param lat - A latitude das coordenadas geográficas.
 * @param lng - A longitude das coordenadas geográficas.
 * @returns Um objeto AddressResult contendo o endereço formatado ou um erro, se ocorrer.
 */
export default async function AddressGeocode(lat: number, lng: number): Promise<AddressResult> {
    const loader = new Loader({
        apiKey: import.meta.env.VITE_nao_apiKey,
    });

    try {
        await loader.load();
    } catch (error) {
        return {
            address: null,
            error: `Erro ao carregar a API do Google Maps: ${error}`,
        };
    }

    return new Promise((resolve) => {
        const geocoder = new google.maps.Geocoder();
        const latLng = new google.maps.LatLng(lat, lng);

        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results) {
                    if (results[0]) {
                        resolve({
                            address: results[0].formatted_address,
                            error: null,
                        });
                    } else {
                        resolve({
                            address: null,
                            error: 'Endereço não encontrado.',
                        });
                    }
                }
            } else {
                resolve({
                    address: null,
                    error: `Geocoder falhou devido a: ${status}`,
                });
            }
        });
    });
}
