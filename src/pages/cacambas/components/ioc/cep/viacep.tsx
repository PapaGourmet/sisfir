import axios, { AxiosRequestConfig } from "axios"
import { ICep } from "./icep"

export class ViaCep implements ICep {
    async getCep(cep: string): Promise<{
        logradouro: string
        bairro: string
        localidade: string
        uf: string
    } | undefined> {
        const config: AxiosRequestConfig = {
            url: `https://viacep.com.br/ws/${cep}/json/`,
            method: 'get'
        }

        try {
            const response = await axios(config)
            if (response.status >= 200 && response.status < 300) {
                const { logradouro, bairro, localidade, uf } = response.data
                return { logradouro, bairro, localidade, uf }
            } else {
                throw new Error("Erro ao obter o endereço do CEP.")
            }
        } catch (error) {
            throw new Error("Erro ao realizar a requisição para a API ViaCep.")
        }
    }
}