import React, { useRef, useState } from "react"
import { initializeApp } from "firebase/app"
import firebaseNAOConfig from '../../../../util/firebase-nao-config'
const firebase = initializeApp(firebaseNAOConfig, "listar")
import { getFirestore } from "firebase/firestore"
const database = getFirestore(firebase)
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import {
    query,
    collection,
} from "firebase/firestore";
import Loading from "../../../../bundles/loading/loading"
import { Link } from "react-router-dom"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { GetEmpresasDownload, RemoveAcesso, RemoveEmpresa, UpdateObsEmpresa } from "../../../../services/servicesApi"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faFileCsv } from '@fortawesome/free-solid-svg-icons'
import Modal from "react-modal"
const tiposDeEmpresa = ['Extraordinário', 'Biológico', 'Reciclagem']
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import IAcesso from "../../../../interfaces/iacessos"
import IResponse from "../../../../interfaces/iresponse"
import { unparse } from 'papaparse'
import { writeFile, utils } from 'xlsx';

const schema = z.object({
    tipo: z.string().nonempty('Informe o tipo de coleta')
})

type FormSchema = z.infer<typeof schema>

/**
 * Combina os atributos dos objetos IAcesso com os atributos dos objetos IData nas listas 'acessos'.
 *
 * @param acessosList - Uma lista de objetos do tipo IAcesso.
 * @returns Uma lista de objetos do tipo IResponse.
 */
function shallowEqualObjects(acessosList: IAcesso[]): IResponse[] {
    const responseList: IResponse[] = [];

    acessosList.forEach((acesso) => {
        acesso.acessos.forEach((acessoData) => {
            const responseObject: IResponse = {
                link: acessoData.link,
                login: acessoData.login,
                monitoramento: acessoData.monitoramento,
                senha: acessoData.senha,
                nome: acesso.nome,
                obs: acesso.obs,
                tipo: acesso.tipo,
            };

            responseList.push(responseObject);
        });
    });

    return responseList;
}


/**
 * Gera e faz o download de um arquivo XLSX a partir de uma lista de objetos IAcesso.
 *
 * @param acessosList - Uma lista de objetos do tipo IAcesso.
 * @param fileName - O nome do arquivo XLSX a ser gerado (opcional).
 */
export function downloadShallowEqualObjectsXlsx(acessosList: IAcesso[], fileName: string = 'output.xlsx'): void {
    const responseList: IResponse[] = shallowEqualObjects(acessosList);

    // Cria uma planilha a partir dos dados da lista de objetos IResponse
    const worksheet = utils.json_to_sheet(responseList);

    // Cria um novo arquivo XLSX e adiciona a planilha
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Gera o arquivo XLSX e faz o download
    writeFile(workbook, fileName);
}


export default function ListEnterprises() {
    const [isLoading, setIsLoading] = useState(false)
    const [tipo, setTipo] = useState<any>()
    const [empresa, setEmpresa] = useState<any>()
    const [id, setId] = useState<any>()
    const [acessoDelete, setAcessoDelete] = useState()

    const refTextArea = useRef<HTMLTextAreaElement>()
    const refTextAreaClone = useRef<HTMLTextAreaElement>()
    const [showText, setShowText] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormSchema>({
        resolver: zodResolver(schema)
    })


    //#region Modal Empresa
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleDeleteClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirmClick = () => {

        setIsModalOpen(false);
        setIsLoading(true)
        RemoveEmpresa(id)
            .then(() => {
                setIsLoading(false)
                window.location.reload()
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err)
            })
    };

    const handleCancelClick = () => {
        setIsModalOpen(false);
    };
    //#endregion

    //#region Modal Acesso
    const [isModalOpenAcesso, setIsModalOpenAcesso] = useState(false);

    const handleDeleteClickAcesso = () => {
        setIsModalOpenAcesso(true);
    };

    const handleConfirmClickAcesso = () => {

        setIsModalOpenAcesso(false);
        remove(acessoDelete)

    };

    const handleCancelClickAcesso = () => {
        setIsModalOpenAcesso(false);
    };
    //#endregion

    // Define a query reference using the Firebase SDK
    const reference = query(collection(database, "empresas"));

    // Provide the query to the hook
    const q = useFirestoreQuery(["empresas"], reference, {
        subscribe: true,
    });

    if (q.isLoading) {
        return <div className="flex items-center justify-center">
            <Loading />
        </div>;
    }

    const snapshot = q.data;

    const remove = (data: any) => {
        setIsLoading(true)
        RemoveAcesso(id, data)
            .then(() => {
                setIsLoading(false)
                window.location.reload();
            })
            .catch((err) => {
                console.log(err)
                setIsLoading(false)
            })
    }


    const download = (data: any) => {
        const { tipo } = data
        const value = tiposDeEmpresa[parseInt(tipo)]

        GetEmpresasDownload(value)
            .then(response => {
                try {
                    downloadShallowEqualObjectsXlsx(response, `${value}.xlsx`)
                } catch (err) {
                    console.log(err)
                }

            })
            .catch(err => console.log(err))
    }


    return (
        <main>
            <Modal
                isOpen={isModalOpen}
                ariaHideApp={false}
                className="flex w-full h-screen items-center justify-center bg-slate-500"
            >
                <div className="flex flex-col">
                    <p className="text-center text-white">Tem certeza que deseja deletar este item?</p>
                    <div className="grid grid-cols-12 mt-6">
                        <div className="col-span-5">
                            <button
                                type="button"
                                className="border-2 border-green-600 text-green-300 p-2 rounded-lg"
                                style={{
                                    width: "6rem"
                                }}
                                onClick={handleConfirmClick}>Sim</button>
                        </div>
                        <div className="col-span-2"></div>
                        <div className="col-span-5">
                            <button
                                type="button"
                                className="border-2 border-red-600 text-red-600 p-2 rounded-xl"
                                style={{
                                    width: "6rem"
                                }}
                                onClick={handleCancelClick}
                            >Cancelar</button>
                        </div>
                    </div>



                </div>
            </Modal>

            <Modal
                isOpen={isModalOpenAcesso}
                ariaHideApp={false}
                className="flex w-full h-screen items-center justify-center bg-slate-500"
            >
                <div className="flex flex-col">
                    <p className="text-center text-white">Tem certeza que deseja deletar este item?</p>
                    <div className="grid grid-cols-12 mt-6">
                        <div className="col-span-5">
                            <button
                                type="button"
                                className="border-2 border-green-600 text-green-300 p-2 rounded-lg"
                                style={{
                                    width: "6rem"
                                }}
                                onClick={handleConfirmClickAcesso}>Sim</button>
                        </div>
                        <div className="col-span-2"></div>
                        <div className="col-span-5">
                            <button
                                type="button"
                                className="border-2 border-red-600 text-red-600 p-2 rounded-xl"
                                style={{
                                    width: "6rem"
                                }}
                                onClick={handleCancelClickAcesso}
                            >Cancelar</button>
                        </div>
                    </div>



                </div>
            </Modal>

            <div className="flex items-center justify-center bg-blue-950 text-white font-bold p-2">
                <h1>LISTAR EMPRESAS E ACESSOS</h1>
            </div>

            <div className="grid grid-cols-1 mx-8 mt-3">
                <form onSubmit={handleSubmit(download)}>
                    <label>Tipo</label>
                    <div className="grid grid-cols-12">
                        <div className="col-span-11">
                            <select className="border p-1  w-full rounded-md outline-none" id="exampleFormControlSelect1"
                                {...register('tipo')}
                                onChange={(item) => {
                                    setTipo(item.target.value)
                                }}
                            >
                                <option key={1000}></option>
                                {tiposDeEmpresa.map((x, i) => (
                                    <option value={i}>{x}</option>
                                ))}
                            </select>

                        </div>

                        <button
                            type="submit"
                            className="flex items-center justify-center  text-green-700 hover:text-cyan-400"
                        >
                            <FontAwesomeIcon icon={faFileCsv} size={'xl'} />
                        </button>

                    </div>
                    {errors.tipo && <span className="mb-6 text-red-700">{errors.tipo.message}</span>}
                </form>


                {tipo && <>
                    <label>Empresa</label>
                    <select className="border p-1 rounded-md outline-none" id="exampleFormControlSelect1"
                        onChange={(item) => {
                            setEmpresa(null)

                            if (item) {
                                setId(item.target.value)
                                const x = snapshot?.docs.filter(x => x.id === item.target.value)
                                setEmpresa(x![0].data())
                            }
                        }}
                    >
                        <option key={1000}></option>
                        {snapshot?.docs
                            .sort(function (a: any, b: any) {
                                return a.data().nome.localeCompare(b.data().nome);
                            })
                            .filter(x => x.data().tipo === tiposDeEmpresa[tipo])
                            .map((x, i) => (
                                <option key={i + 1234} value={x.id}>{x.data().nome}</option>
                            ))}
                    </select>
                </>}

                {empresa && <div className="grid grid-cols-1 gap-2 mx-6 md:mx-24 lg:mx-80">
                    {empresa.acessos.map((x: any, i: number) => (
                        <>
                            <ul key={i + 1000} className="border mt-10 p-3 rounded-2xl shadow-2xl bg-slate-400">

                                <li className="border p-2 grid grid-cols-2 mt-2 mb-2 rounded-lg bg-white" key={i + 564}>
                                    <p className="truncate">{`Monitoramento: ${x.monitoramento}`}</p>
                                </li>

                                <li className="border p-2 rounded-lg  bg-white truncate" key={i + 2567}>
                                    <a className="text-green-600" href={x.link} target="_blank">{x.link}</a>
                                </li>

                                <li className="border p-2 grid grid-cols-2 mt-2 mb-2 rounded-lg bg-white" key={i + 574}>
                                    <p className="truncate">{`Usuário: ${x.login}`}</p>
                                    <CopyToClipboard text={x.login.trim() || ""}><p className="text-lime-500 hover:text-red-600">copiar</p></CopyToClipboard>
                                </li>

                                <li className="border p-2 grid grid-cols-2 mt-2 mb-2 rounded-lg  bg-white" key={i + 333}>
                                    <p className="truncate">{`Senha: ${x.senha}`}</p>
                                    <CopyToClipboard text={x.senha.trim() || ""}><p className="text-lime-500 hover:text-red-600">copiar</p></CopyToClipboard>

                                </li>

                                <li className="flex items-center justify-center mt-2 mb-2 rounded-lg  bg-white" key={i + 8976}>
                                    <button
                                        className="border p-1 m-1 rounded-md bg-teal-700 hover:bg-teal-600 text-white text-1xl"
                                        onClick={() => {
                                            setIsModalOpenAcesso(true)
                                            setAcessoDelete(x)
                                        }}
                                    >
                                        remover
                                    </button>
                                </li>
                            </ul>
                        </>
                    ))}

                </div>}



            </div>

            {empresa && <>
                <label htmlFor="obs" className="mt-5 mx-8">Observações</label>
                <div className="grid grid-cols-12 items-center justify-center mx-8">
                    {!showText && <>
                        <textarea
                            //@ts-ignore
                            ref={refTextArea}
                            disabled
                            value={empresa.obs ? empresa.obs : ""}
                            className="border rounded-tl-lg rounded-bl-lg col-span-9 md:col-span-11 h-full p-3"
                            id="obs"
                            rows={3}
                        ></textarea>


                        <button
                            type="button"
                            className="outline-none border rounded-tr-lg rounded-br h-full w-full col-span-3 md:col-span-1 text-teal-600 hover:text-teal-950 hover:bg-teal-50 text-sm md:text-xl truncate"
                            onClick={() => {
                                const value = refTextArea.current!.value
                                setShowText(true)
                                setTimeout(() => {
                                    refTextAreaClone.current!.value = value
                                }, 200)
                            }}
                        >
                            atualizar
                        </button>
                    </>}


                    {showText && <>
                        <textarea
                            //@ts-ignore
                            ref={refTextAreaClone}
                            className="border rounded-tl-lg rounded-bl-lg col-span-9 md:col-span-11 h-full p-3 hover:bg-teal-50"
                            id="obs"
                            rows={3}
                        ></textarea>

                        <button
                            type="button"
                            className="outline-none border rounded-tr-lg rounded-br h-full w-full col-span-3 md:col-span-1 text-teal-600 hover:text-teal-950 hover:bg-teal-50 text-sm md:text-xl truncate"
                            onClick={() => {
                                setIsLoading(true)

                                UpdateObsEmpresa(id, refTextAreaClone.current!.value || "")
                                    .then(() => {
                                        setIsLoading(false)
                                        setShowText(false)
                                        empresa.obs = refTextAreaClone.current!.value
                                    })

                                    .catch(err => {
                                        setIsLoading(false)
                                        console.log(err)
                                    })

                            }}
                        >
                            salvar
                        </button>
                    </>}

                </div>
            </>}



            {empresa && <div className="flex flex-col">
                <div className="flex items-center justify-center mx-8 border mt-4 h-20 rounded-md mb-10">
                    <button
                        type="button"
                        className="bg-emerald-700 w-16 h-16 rounded-full hover:bg-red-600  text-white"
                        onClick={() => {
                            setIsModalOpen(true)
                        }}
                    >
                        <FontAwesomeIcon icon={faTrash} size={'xl'} />
                    </button>
                </div>

            </div>}



            {isLoading && <div className="flex items-center justify-center">
                <Loading />
            </div>}
        </main >
    )
}