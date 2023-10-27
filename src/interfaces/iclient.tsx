import React from "react";

interface IClient {
    type?: string;
    insc?: string;
    name: string;
    zip?: string;
    bairro?: string;
    cep?: string;
    localidade?: string;
    logradouro?: string;
    uf?: string;
    numero?: string;
    complemento?: string;
    fix?: string;
    cel?: string;
    uid: string;
    id: string;
    status?: boolean;
}

export default IClient;