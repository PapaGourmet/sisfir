import { AnyCatcher } from "rxjs/internal/AnyCatcher";
import IOs from "../../../interfaces/OS";
import IOrdem from "../../../interfaces/iordem";

export interface IOrdemService {
    addOrdem(data: string, ordem: IOrdem, numeroOrdem: any): Promise<void>
    updateOrdem(data: string, ordem: IOrdem, numeroOrdem: any, OS: IOs): Promise<void>
    getDayOrdem(data: string): Promise<any>
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
}