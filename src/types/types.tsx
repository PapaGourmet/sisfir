import React from "react";

export type Coordinate = {
    lat: number;
    lng: number;
    title?: string;
};

export type IFirestoreEnvio = {
    color?: any;
    key: string;
    list: Coordinate[];
    title: string;
    date: string;
    CentralPoint: Coordinate;
    polys: Coordinate[][] | string | google.maps.Polygon[] | any;  //JOSN.stringify()
    fiscais?: number;
};

export type ResponseCep = {
    logradouro: string,
    bairro: string,
    localidade: string,
    uf: string
}

export type FormDataEnvio = {
    id?: string,
    user: string,
    uid: string,
    tipo: string,
    documento: string,
    nome: string,
    email: string,
    cep: string,
    logradouro: string,
    bairro: string,
    municipio: string,
    uf: string,
    numero: string,
    complemento: string,
    celular: string,
    fixo: string,
    status?: boolean
}