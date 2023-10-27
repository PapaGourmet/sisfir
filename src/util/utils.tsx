import { DateTime, Interval } from 'luxon';
import React from "react";
import IEmpresa from '../interfaces/iempresas';
import IScript from '../interfaces/iscript';
import User from '../interfaces/users';


const calDiff = (dt: string) => {
    const now = DateTime.local().setZone("America/Sao_Paulo");
    const date = DateTime.fromISO(dt);
    const interval = Interval.fromDateTimes(date, now)
    return interval;
}


const calColor = (dt: number) => {
    if (dt < 40) {
        return '#40E0D0';
    }

    if ((dt >= 40 && dt <= 48)) {
        return 'yellow';
    }

    return '#FF6347';
}

const findUser = (uid: string, users: User[]) => {
    const index = users.findIndex(x => x.uid === uid);
    if (users[index].razaosocial) {
        return {
            name: users[index].razaosocial,
            type: 'cnpj'
        }
    }

    return {
        name: users[index].nome,
        type: 'cpf'
    }
}

const getDateMonths = (year: number, month: any, init: number, end: number) => {
    const weeks = [
        'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'
    ]

    const months = [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december'
    ]

    const january = [];
    const february = [];
    const march = [];
    const april = [];
    const may = [];
    const june = [];
    const july = [];
    const august = [];
    const september = [];
    const october = [];
    const november = [];
    const december = [];



    for (let index = 1; index < 32; index++) {
        const dt0 = new Date(year, 0, index);
        january.push({ date: dt0, week: weeks[dt0.getDay()], day: index, month: 0, year });
        const dt2 = new Date(year, 2, index);
        march.push({ date: dt2, week: weeks[dt2.getDay()], day: index, month: 2, year });
        const dt4 = new Date(year, 4, index);
        may.push({ date: dt4, week: weeks[dt4.getDay()], day: index, month: 4, year });
        const dt6 = new Date(year, 6, index);
        july.push({ date: dt6, week: weeks[dt6.getDay()], day: index, month: 6, year });
        const dt7 = new Date(year, 7, index);
        august.push({ date: dt7, week: weeks[dt7.getDay()], day: index, month: 7, year });
        const dt9 = new Date(year, 9, index);
        october.push({ date: dt9, week: weeks[dt9.getDay()], day: index, month: 9, year });
        const dt11 = new Date(year, 11, index);
        december.push({ date: dt11, week: weeks[dt11.getDay()], day: index, month: 11, year });
    }

    if (year % 4 === 0) {
        for (let index = 1; index < 30; index++) {
            const dt1 = new Date(year, 1, index);
            february.push({ date: dt1, week: weeks[dt1.getDay()], day: index, month: 1, year });
        }
    } else {
        for (let index = 1; index < 29; index++) {
            const dt1 = new Date(year, 1, index);
            february.push({ date: dt1, week: weeks[dt1.getDay()], day: index, month: 1, year });
        }
    }


    for (let index = 1; index < 31; index++) {
        const dt3 = new Date(year, 3, index);
        april.push({ date: dt3, week: weeks[dt3.getDay()], day: index, month: 1, year });
        const dt5 = new Date(year, 5, index);
        june.push({ date: dt5, week: weeks[dt5.getDay()], day: index, month: 1, year });
        const dt8 = new Date(year, 8, index);
        september.push({ date: dt8, week: weeks[dt8.getDay()], day: index, month: 1, year });
        const dt10 = new Date(year, 10, index);
        november.push({ date: dt10, week: weeks[dt10.getDay()], day: index, month: 1, year });
    }

    const result: any = {
        january,
        february,
        march,
        april,
        may,
        june,
        july,
        august,
        september,
        october,
        november,
        december
    };

    return {
        mon: result[months[month]].filter((x: { week: string; day: number; }) => x.week === 'mon' && x.day <= end && x.day >= init).length,
        tue: result[months[month]].filter((x: { week: string; day: number; }) => x.week === 'tue' && x.day <= end && x.day >= init).length,
        wed: result[months[month]].filter((x: { week: string; day: number; }) => x.week === 'wed' && x.day <= end && x.day >= init).length,
        thu: result[months[month]].filter((x: { week: string; day: number; }) => x.week === 'thu' && x.day <= end && x.day >= init).length,
        fri: result[months[month]].filter((x: { week: string; day: number; }) => x.week === 'fri' && x.day <= end && x.day >= init).length,
        sat: result[months[month]].filter((x: { week: string; day: number; }) => x.week === 'sat' && x.day <= end && x.day >= init).length,
        sun: result[months[month]].filter((x: { week: string; day: number; }) => x.week === 'sun' && x.day <= end && x.day >= init).length
    }

}

const formatDate = (date: string) => {
    const dt = new Date(date);
    const dd = dt.getDate().toString().padStart(2,"0");
    const mm = (dt.getMonth() + 1).toString().padStart(2,"0");
    const yy = dt.getFullYear();
    const hh = dt.getHours().toString().padStart(2,"0");
    const min = dt.getMinutes().toString().padStart(2,"0");
    return `${dd}/${mm}/${yy} as ${hh}:${min}`;
}

const formatScript = (script: IScript) => {
    if(script.mon){
        script.AtuaSegundaInicio = script.Inicio;
        script.AtuaSegundaFim = script.Termino;
    }else{
        script.AtuaSegundaInicio = null;
        script.AtuaSegundaFim = null;
    }

    
    if(script.tue){
        script.AtuaTercaInicio = script.Inicio;
        script.AtuaTercaFim = script.Termino;
    }else{
        script.AtuaTercaInicio = null;
        script.AtuaTercaFim = null;
    }

    if(script.wed){
        script.AtuaQuartaInicio = script.Inicio;
        script.AtuaQuartaFim = script.Termino;
    }else{
        script.AtuaQuartaInicio = null;
        script.AtuaQuartaFim = null;
    }

    if(script.thu){
        script.AtuaQuintaInicio = script.Inicio;
        script.AtuaQuintaFim = script.Termino;
    }else{
        script.AtuaQuintaInicio = null;
        script.AtuaQuintaFim = null;
    }

    if(script.fri){
        script.AtuaSextaInicio = script.Inicio;
        script.AtuaSextaFim = script.Termino;
    }else{
        script.AtuaSextaInicio = null;
        script.AtuaSextaFim = null;
    }

    if(script.sat){
        script.AtuaSabadoInicio = script.Inicio;
        script.AtuaSabadoFim = script.Termino;
    }else{
        script.AtuaSabadoInicio = null;
        script.AtuaSabadoFim = null;
    }

    return script;
}


export { formatDate, getDateMonths, calColor, calDiff, findUser, formatScript }