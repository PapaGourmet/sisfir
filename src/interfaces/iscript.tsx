import React from 'react'

interface IScript {
    Inicio?: string;
    Termino?: string;
    PrefixoVeiculo?: string;
    PlacaVeiculo?: string;
    SiglaDoRoteiro?: string;
    SiglaSetor?: string;
    Turno?: number;
    AtuaSegundaInicio?: string | null;
    AtuaSegundaFim?: string | null;
    AtuaTercaInicio?: string | null;
    AtuaTercaFim?: string | null;
    AtuaQuartaInicio?: string | null;
    AtuaQuartaFim?: string | null;
    AtuaQuintaInicio?: string | null;
    AtuaQuintaFim?: string | null;
    AtuaSextaInicio?: string | null;
    AtuaSextaFim?: string | null;
    AtuaSabadoInicio?: string | null;
    AtuaSabadoFim?: string | null;
    uid?: string;
    time?: number;
    mon?: boolean;
    tue?: boolean;
    wed?: boolean;
    thu?: boolean;
    fri?: boolean;
    sat?: boolean;
    sun?: boolean;

}

export default IScript;