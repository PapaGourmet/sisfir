import { collection, doc, updateDoc } from "firebase/firestore"
import IEmployee from "../../../../../interfaces/iemployee"
import data from "../../../../ordem/create/components/data"

export interface IServiceEmployee {
    getSegmento(): Promise<string[]>
    getEmployees(): Promise<IEmployee[]>
    addEmployee(employee: IEmployee): Promise<void>
    updateEmployee(employee: IEmployee): Promise<void>
}

export class ServiceEmployee {
    constructor(private service: IServiceEmployee) { }

    async getSegmento(): Promise<string[]> {
        return this.service.getSegmento()
    }

    async getEmployees(): Promise<IEmployee[]> {
        return this.service.getEmployees()
    }

    async addEmployee(employee: IEmployee): Promise<void> {
        this.service.addEmployee(employee)
    }

    async updateEmployee(employee: IEmployee): Promise<void> {
        this.service.updateEmployee(employee)
    }
}


