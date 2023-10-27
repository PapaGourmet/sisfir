export interface ICacambaProps {
    id: string,
    documento: string,
    uid: string,
    local?: string,
    numero?: string,
    data: number,
    status: boolean,
    lat: number,
    lng: number,
    nome: string,
    termino?: number
}

export interface IDumpster {
    numeroSerie: string,
    id: string,
    uid: string,
    status: boolean
}

export interface IApplyCacambaService {
    addCacamba(cacamba: ICacambaProps): Promise<void>
    addDumpster(dumpster: IDumpster): Promise<void>
    removeCacamba(id: string): Promise<void>
    removeDumpster(id: string, status: boolean): Promise<void>
    getCacamba(id: string): Promise<ICacambaProps>
    getDumpster(id: string): Promise<IDumpster>
    getDumpsterByRegister(register: string, uid: string): Promise<IDumpster>
    getAllCacamba(): Promise<ICacambaProps[]>
    updateCacamba(id: string, numero: string, termino: number, status: boolean, data?: number): Promise<void>
}

export class ApplyCacambaService {
    constructor(private service: IApplyCacambaService) { }

    async addCacamba(cacamba: ICacambaProps): Promise<void> {
        this.service.addCacamba(cacamba)
    }

    async removeCacamba(id: string): Promise<void> {
        this.service.removeCacamba(id)
    }

    async getCacamba(id: string): Promise<ICacambaProps> {
        return this.service.getCacamba(id)
    }

    async getAllCacamba(): Promise<ICacambaProps[]> {
        return this.service.getAllCacamba()
    }

    async addDumpster(dumpster: IDumpster): Promise<void> {
        this.service.addDumpster(dumpster)
    }

    async removeDumpster(id: string, status: boolean): Promise<void> {
        this.service.removeDumpster(id, status)
    }

    async geDumpster(id: string): Promise<IDumpster> {
        return this.service.getDumpster(id)
    }

    async getDumpsterByRegister(register: string, uid: string): Promise<IDumpster> {
        return this.service.getDumpsterByRegister(register, uid)
    }

    async updateCacamba(id: string, numero: string, termino: number, status: boolean, data?: number): Promise<void> {
        return this.service.updateCacamba(id, numero, termino, status, data)
    }

}