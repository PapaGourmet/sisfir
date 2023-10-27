import React from "react"

interface IData {
    link: string,
    login: string,
    monitoramento: string,
    senha: string
}


export default interface IAcesso {
    acessos: [IData],
    nome: string,
    obs: string,
    tipo: string
}

