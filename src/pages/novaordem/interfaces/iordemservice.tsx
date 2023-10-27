import { AnyCatcher } from "rxjs/internal/AnyCatcher";
import IOs from "../../../interfaces/OS";
import IOrdem from "../../../interfaces/iordem";

export interface IOrdemService {
    addOrdem(data: string, ordem: IOrdem, numeroOrdem: any): Promise<void>
    updateOrdem(data: string): Promise<void>
    getDayOrdem(data: string): Promise<IOrdem[]>
}


export class OrdemService {
    constructor(private service: IOrdemService) { }

    async addOrdem(data: string, ordem: IOrdem, numeroOrdem: any): Promise<void> {
        this.service.addOrdem(data, ordem, numeroOrdem)
    }

    async updateOrdem(data: string): Promise<void> {
        this.service.updateOrdem(data)
    }

    async getDayOrdem(data: string): Promise<IOrdem[]> {
        return this.service.getDayOrdem(data)
    }
}