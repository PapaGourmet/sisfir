import React from "react";

interface IEmpresa {
    id?: string | undefined;
    autorizada?: boolean;
    cnpj?: string;
    razaosocial?: string;
    email?: string;
    rules?: string[];
    uid?: string;
    type?: string;
}

export default IEmpresa;