export interface IGoogleAutocompleteRequest {
    searchPlace: (address: string) => Promise<google.maps.LatLng>
}

export class GoogleAutocompleteRequest {
    constructor(private request: IGoogleAutocompleteRequest) { }

    async adicionarCliente(local: string): Promise<google.maps.LatLng> {
        return await this.request.searchPlace(local)
    }
}
