import IOs from "../interfaces/OS";
import IOrdem from "../interfaces/iordem";

export interface IServiceOrder {
    getOrdem(data: string): Promise<IOs>
    deleteOrdem(data: any, ordens: IOrdem[], id: any): Promise<void>
    getDayOrdem(data: string): Promise<IOrdem[]>
    insertOrdem(data: string, ordem: IOrdem, id: any): Promise<void>
}

export class ServiceOrder {
    constructor(private service: IServiceOrder) { }


    async getOrdem(data: string): Promise<IOs> {
        return this.service.getOrdem(data)
    }


    async deleteOrdem(data: any, ordens: IOrdem[], id: any): Promise<void> {
        this.service.deleteOrdem(data, ordens, id)
    }

    async getDayOrdem(data: string): Promise<IOrdem[]> {
        return this.service.getDayOrdem(data)
    }

    async insertOrdem(data: string, ordem: IOrdem, id: any): Promise<void> {
        this.insertOrdem(data, ordem, id)
    }

}