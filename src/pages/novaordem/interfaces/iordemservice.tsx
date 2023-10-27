import { AnyCatcher } from "rxjs/internal/AnyCatcher";
import IOs from "../../../interfaces/OS";
import IOrdem from "../../../interfaces/iordem";

export interface IOrdemService {
    addOrdem(data: string, ordem: IOrdem, numeroOrdem: any): Promise<void>
    updateOrdem(data: string, ordem: IOrdem, numeroOrdem: any, OS: IOs): Promise<void>
    getDayOrdem(data: string): Promise<any>
    getCount(): Promise<number | undefined>
    setTotal(): Promise<void>
    getTotal(): Promise<number>
}


export class OrdemService {
    constructor(private service: IOrdemService) { }

    async addOrdem(data: string, ordem: IOrdem, numeroOrdem: any): Promise<void> {
        this.service.addOrdem(data, ordem, numeroOrdem)
    }

    async updateOrdem(data: string, ordem: IOrdem, numeroOrdem: any, OS: IOs): Promise<void> {
        this.service.updateOrdem(data, ordem, numeroOrdem, OS)
    }

    async getDayOrdem(data: string): Promise<any> {
        return this.service.getDayOrdem(data)
    }

    async getCount(): Promise<number | undefined> {
        return this.service.getCount()
    }

    async setTotal(): Promise<void> {
        this.service.setTotal()
    }

    async getTotal(): Promise<number> {
        return this.service.getTotal()
    }
}