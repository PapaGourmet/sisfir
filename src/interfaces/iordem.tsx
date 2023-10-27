import React from 'react';
import IEmployee from './iemployee';
import ILocation from './location';


interface IOrdem {
    segmento?: string[];
    timestamp?: any;
    motivacao?: string;
    local?: string;
    acao?: string[];
    integracao?: string[];
    recursos?: string[];
    equipe?: IEmployee[];
    status?: boolean;
    dataOrdem?: string;
    inicio?: string;
    fim?: string;
    uid?: string | undefined | null;
    email?: string | undefined | null;
    key?: string;
    unit?: string[] | undefined;
    orientacao?: string | undefined | null;
    geocode?: ILocation | undefined | null;
    cancelamento?: string;
    tipo?: string;
    relatorio?: string | undefined | null;
    relator?: string | undefined | null;
    responsavel?: string | undefined | null;
    dataEnvio?: Date | number | any
    id?: any
}

export default IOrdem;