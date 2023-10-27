import React from "react";
import axios, { AxiosPromise } from 'axios';
import Mtr from "../interfaces/mtr";
import objectId from "../interfaces/objectId";
const URL = 'https://fcz-mtrs-default-rtdb.firebaseio.com/mtrs.json';


const getMtr = (numero: string): AxiosPromise<any> => {
    const urlQuery = `${URL}?orderBy="numero"&equalTo="${numero}"`;

    const config = {
        url: urlQuery,
        method: 'get'
    }

    return axios(config);

}

const putMtr = (mtr: string, objectId: string, data: Mtr) => {

    var obj: objectId = {};

    obj[objectId] = {
        numero: data.numero,
        validado: data.validado,
        data: data.data,
        id: data.id
    };

    const config = {
        url: URL,
        method: 'put',
        data: obj
    }

    return axios(config);
}

export { getMtr, putMtr }