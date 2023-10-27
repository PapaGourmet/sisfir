import { FormDataEnvio } from "../../../../../types/types";

export interface IClienteDatabase {
  salvarCliente: (cliente: FormDataEnvio) => Promise<void>
  atualizarCliente: (cliente: FormDataEnvio) => Promise<void>
  reativarClienteById(id: string): Promise<void>
  inativarClienteById(id: string): Promise<void>
  getClienteId: (id: string) => Promise<FormDataEnvio | null | undefined>
  getClienteDocumento: (document: string, uid: string) => Promise<FormDataEnvio | null | undefined>
}

export class ClienteManager {
  constructor(private database: IClienteDatabase) { }

  /**
   * Salva ou atualiza uma subcoleção clientes de uma coleção cacambas no firestore (fcz-nao)
   * @param cliente 
   */
  async adicionarCliente(cliente: FormDataEnvio) {
    await this.database.salvarCliente(cliente)
  }

  async atualizarCliente(cliente: FormDataEnvio) {
    await this.database.atualizarCliente(cliente)
  }

  async buscarCliente(id: string) {
    return await this.database.getClienteId(id)
  }

  async inativarCliente(id: string) {
    return await this.database.inativarClienteById(id)
  }

  async reativarCliente(id: string) {
    return await this.database.reativarClienteById(id)
  }

  async buscarClientePorDocumento(documento: string, uid: string) {
    return await this.database.getClienteDocumento(documento, uid)
  }
}


