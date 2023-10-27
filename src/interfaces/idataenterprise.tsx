import React from "react";

interface IDataAcesso {
    monitoramento?: string,
    login?: string,
    senha?: string,
    link?: string
}

export default interface IDataEnterprise {
    tipo: string,
    nome: string,
    obs?: string,
    acessos?: [IDataAcesso?]
}