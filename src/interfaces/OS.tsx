import React from 'react';
import IOrdem from './iordem';

interface IOs {
    data?: string,
    aprovador: string,
    aprovado: boolean,
    obs: string,
    semana?: string,
    ordens?: IOrdem[]
}


export default IOs;