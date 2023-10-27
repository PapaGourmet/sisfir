import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import firebaseConfig from '../../../util/firebase-config';
import { getDatabase } from 'firebase/database';
import Loading from "../../../bundles/loading/loading";
import IEmployee from '../../../interfaces/iemployee';
import IOrdem from '../../../interfaces/iordem';
import moment from "moment";
import { DeleteOrdem, GetDayOrdem, GetOrdem, InsertAproveOS } from "../../../services/servicesApi";
import IOs from "../../../interfaces/OS";
import axios, { AxiosRequestConfig } from "axios";
const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);
const agora = moment();

const sort = (a: IEmployee, b: IEmployee) => {
    if (a.name > b.name) {
        return 1;
    }

    if (a.name < b.name) {
        return -1;
    }

    return 0;
}

const formataData = (data: string) => {
    const yy = data.substring(0, 4);
    const mm = data.substring(5, 7);
    const dd = data.substring(8);
    return `${dd}-${mm}-${yy}`
}

interface IList {
    label: string,
    value: string
}

const sortList = (a: IList, b: IList) => {
    if (a.label > b.label) {
        return 1;
    }

    if (a.label < b.label) {
        return -1;
    }

    return 0;
}

function refreshPage() {
    window.location.reload();
}


export default function ManageOrdem() {
    const [msg, setMsg] = useState("Fiscal já escalado para a OS");
    const [style, setStyle] = useState("alert-danger");
    const [showMsg, setShowMsg] = useState(false);
    const [ordens, setOrdens] = useState<IOrdem[]>([]);
    const [ordem, setOrdem] = useState<IOrdem | null | undefined>();
    const [dia, setDia] = useState<string | null | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [justifica, setJustifica] = useState<any>(undefined);
    const [showJustifica, setShowJustifica] = useState(false);
    const [value, setValue] = useState<any>();
    const [motivo, setMotivo] = useState<any>();
    const [aprovado, setAprovado] = useState<boolean | undefined>(undefined);
    const nao = localStorage.getItem("nao");
    const [isNao, setIsNao] = useState(nao ? true : false);
    const admin = localStorage.getItem("admin");
    const [isAdmin, setIsAdmin] = useState(admin ? true : false);

    const testDay = () => {
        if (!dia) {
            setMsg("É necessário informar uma data");
            setShowMsg(true);
            return;
        }
    }

    const testOrder = () => {
        if (!ordem) {
            setMsg("É necessário escolher uma ordem de serviço");
            setShowMsg(true);
            return;
        } else {
            setShow(!show);
        }
    }

    return (
        <main>
            <div className="flex items-center justify-center bg-blue-950 text-white font-bold p-2">
                <h1>GERENCIAR ORDENS DE SERVIÇO</h1>
            </div>

            {showMsg && <div className={`alert ${style}`} role="alert">
                {msg}
            </div>}
            <div className='grid grid-cols-1 mx-8 mt-3'>
                <label htmlFor="data">Data</label>
                <input
                    type="date"
                    className="form-control"
                    id="data"
                    onChange={(item) => {
                        setShowMsg(false);
                        setShowJustifica(false);
                        setIsLoading(true);
                        setAprovado(undefined);
                        const data = formataData(item.target.value);
                        setDia(data);
                        GetDayOrdem(data)
                            .then(response => {
                                setIsLoading(false);
                                setOrdens(response.filter((x: IOrdem) => x.status));
                            })

                            .catch(err => {
                                setIsLoading(false);
                            })

                        GetOrdem(data)
                            .then(response => {
                                if (response?.aprovado) {
                                    setAprovado(true);
                                } else {
                                    if (response?.aprovado === false) {
                                        setAprovado(false);
                                        setShowJustifica(true);
                                        setJustifica(response?.obs);
                                    }
                                }
                                setIsLoading(false);
                            })

                            .catch(err => {
                                setIsLoading(false);
                            })
                    }}
                ></input>
            </div>

            <div className='grid grid-cols-1 mx-8 mt-3'>
                <label htmlFor="segmento">Ordem de serviço</label>
                <select
                    className="form-control"
                    id="segmento"
                    value={value ? value : ""}
                    onChange={(item) => {
                        const value = item.target.value
                        setShow(false)
                        if (value && value !== 'selecione ...') {
                            setShowMsg(false);
                            setValue(value);
                            const index = ordens.findIndex((x: IOrdem) => x.key === value);
                            const ordem = ordens[index];
                            setOrdem({ ...ordem, status: false });
                        }
                    }}
                >
                    <option>selecione ...</option>
                    {
                        ordens.map((x: IOrdem) => (
                            <option key={x.key} value={x.key}>{x.key}</option>
                        ))
                    }
                </select>
            </div>

            {!show && dia && <div className="flex items-center justify-center mx-8 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-20">
                    <div className="mb-4">
                        <button
                            type="button"
                            className="bg-teal-900 hover:bg-teal-600 w-72 h-9 px-4 rounded-xl text-white text-center"
                            onClick={() => {
                                setShowMsg(false);
                                testDay();
                                testOrder();
                            }}
                        >cancelar ordem de serviço ativa</button>
                    </div>

                    <div className="mb-4">
                        <button
                            type="button"
                            className="bg-teal-900 hover:bg-teal-600 w-72 h-9 px-4 rounded-xl text-white text-center"
                            onClick={() => {
                                setShowMsg(false);
                                testDay();
                                const url = `https://us-central1-fcz-nao.cloudfunctions.net/app?data=${dia}`;
                                if (ordens.length === 0) {
                                    setMsg("Não há ordens ativas para o dia seleciondo.")
                                    setShowMsg(true);
                                    return;
                                }
                                window.open(url, '_blank', 'noreferrer');
                            }}
                        >baixar ordens ativas do dia</button>
                    </div>
                </div>
            </div>}

            {show && <>

                <div className='grid grid-cols-1 mx-8 mt-3'>
                    <div className="alert alert-info" role="alert">
                        Deseja confirmar o cancelamento dessa ordem de serviço?
                    </div>
                </div>

                <div className='grid grid-cols-1 mx-8 mt-3'>
                    <label htmlFor="motivo">Justificativa</label>
                    <textarea
                        className="form-control"
                        id="motivo"
                        rows={3}
                        onChange={
                            (item) => {
                                item && setMotivo(item.target.value);
                            }
                        }
                    ></textarea>
                </div>

                <div className="flex items-center justify-center mx-8 mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-20">
                        <div className="mb-4">
                            <button
                                type="button"
                                className="bg-teal-900 hover:bg-teal-600 w-72 h-9 px-4 rounded-xl text-white text-center"

                                onClick={() => {
                                    setShow(!show);
                                }}
                            >cancelar</button>
                        </div>

                        <div className="mb-4">
                            <button
                                type="button"
                                className="bg-teal-900 hover:bg-teal-600 w-72 h-9 px-4 rounded-xl text-white text-center"
                                onClick={() => {
                                    setShowMsg(false);

                                    if (!motivo) {
                                        setShowMsg(true);
                                        setMsg("Informe a justificativa para prosseguir.");
                                        return;
                                    }

                                    setIsLoading(true);
                                    const index = ordens.findIndex((x: IOrdem) => x.key === value);
                                    ordens[index].status = false;
                                    ordens[index].cancelamento = motivo;

                                    DeleteOrdem(dia, ordens, value)
                                        .then(data => {
                                            setIsLoading(false);
                                            refreshPage();
                                        })
                                        .catch(err => {
                                            setIsLoading(false);
                                            console.log(err);
                                        });
                                }}
                            >confirmar</button>
                        </div>
                    </div>
                </div>

            </>}

            {ordens.length > 0 && <>

                {dia && <div className='grid grid-cols-1 mx-8 mt-3'>
                    <div className={`${!aprovado ? "alert alert-danger" : "alert alert-success"}`} role="alert">
                        {`${aprovado === undefined ? "Aguardando aprovação do coordenador" : !aprovado ? "Desaprovado pelo coordenador" : "aprovado pelo coordenador"}`}
                    </div>
                </div>}

                {showJustifica && <div className='grid grid-cols-1 mx-8 mt-3'>
                    <label htmlFor="segmento">Motivo:</label>
                    <div className="alert alert-danger" role="alert">
                        {justifica}
                    </div>
                </div>}


                {!aprovado && dia && isAdmin && <>
                    <div className='grid grid-cols-1 mx-8 mt-3'>
                        <label htmlFor="motivo">Justificativa</label>
                        <textarea
                            className="form-control"
                            id="motivo"
                            rows={3}
                            onChange={
                                (item) => {
                                    setShowMsg(false);
                                    item && setJustifica(item.target.value);
                                }
                            }
                        ></textarea>
                    </div>

                    <div className="flex items-center justify-center mx-8 mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-20">
                            <div className="mb-4">
                                <button
                                    type="button"
                                    className="bg-teal-900 hover:bg-teal-600 w-72 h-9 px-4 rounded-xl text-white text-center"

                                    onClick={() => {
                                        setIsLoading(true);

                                        if (!justifica) {
                                            setShowMsg(true);
                                            setMsg("Informe a justificativa da desaprovação!")
                                        }


                                        InsertAproveOS(dia!, localStorage.getItem('email') || "", false, justifica)
                                            .then(data => {
                                                setIsLoading(false);
                                                setAprovado(false);
                                            })

                                    }}
                                >desaprovar</button>
                            </div>

                            <div className="mb-4">
                                <button
                                    type="button"
                                    className="bg-teal-900 hover:bg-teal-600 w-72 h-9 px-4 rounded-xl text-white text-center"
                                    onClick={() => {
                                        setJustifica(null);
                                        InsertAproveOS(dia, localStorage.getItem('email') || "", true, "")
                                            .then(data => {
                                                setIsLoading(false);
                                                setAprovado(true);
                                                setShowJustifica(false);
                                            })
                                    }}
                                >aprovar</button>
                            </div>
                        </div>
                    </div>
                </>}

            </>}

            {dia && ordens.length === 0 && <div className='grid grid-cols-1 mx-8 mt-3'>
                <div className="alert alert-info" role="alert">
                    Sem ordens de serviço para aprovação do coordenador
                </div>
            </div>}

            {aprovado && dia && ordens.length > 0 && <div className='flex items-center justify-center mx-8 mt-3'>
                <div className="mb-4">
                    <button
                        type="button"
                        className="bg-teal-900 hover:bg-teal-600 w-72 h-9 px-4 rounded-xl text-white text-center"

                        onClick={() => {
                            setIsLoading(true);
                            const url = `https://us-central1-fcz-cacambas.cloudfunctions.net/app?dia=${dia}`
                            const config: AxiosRequestConfig = {
                                url,
                                method: 'get'
                            }

                            axios(config)
                                .then(data => {
                                    setIsLoading(false);
                                    setShowMsg(true);
                                    setMsg("Email enviados com sucesso");
                                    console.log(data);
                                })
                                .catch(err => {
                                    console.log(err);
                                    setIsLoading(false);
                                })

                        }}
                    >Enviar link por email</button>
                </div>
            </div>}

        </main>
    )
}
