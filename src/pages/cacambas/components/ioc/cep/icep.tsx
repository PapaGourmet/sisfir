export interface ICep {
    getCep: (cep: string) => Promise<{
        logradouro: string;
        bairro: string;
        localidade: string;
        uf: string;
    } | undefined>;
}

export class CepManager {
    constructor(private service: ICep) { }

    async buscarCep(cep: string) {
        const response = await this.service.getCep(cep)
        return response
    }
}