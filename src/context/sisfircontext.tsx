import { createContext, ReactNode, useEffect, useState } from "react"
import IOrdem from "../interfaces/iordem";
import IOs from "../interfaces/OS";
import { GetOpcoes } from "../services/servicesApi";
import IOptions from "../interfaces/ioptions";
import { DocumentData } from "firebase/firestore";
import ILocation from "../interfaces/location";
import IEmployee from "../interfaces/iemployee";

type MegaProps = {
    children: ReactNode;
}

interface IMegaProps {
    ordem: IOrdem,
    setOrdem: React.Dispatch<React.SetStateAction<IOrdem>>
    OS: IOs | null,
    setOS: React.Dispatch<React.SetStateAction<IOs | null>>,
    options: IOptions | DocumentData,
    equipes: IEmployee[],
    setEquipes: React.Dispatch<React.SetStateAction<IEmployee[]>>,
    dataOS: string | null,
    setDataOS: React.Dispatch<React.SetStateAction<string | null>>
}

export const sisfirContext = createContext<IMegaProps>({} as IMegaProps)

const ord: IOrdem = { status: true }


export const SisfirProvider = ({ children }: MegaProps) => {
    const [ordem, setOrdem] = useState<IOrdem>(ord)
    const [equipes, setEquipes] = useState<IEmployee[]>([])
    const [OS, setOS] = useState<IOs | null>(null)
    const [options, setOptions] = useState<IOptions | DocumentData>([])
    const [dataOS, setDataOS] = useState<string | null>(null)
    useEffect(() => {

    }, [])

    useEffect(() => {
        GetOpcoes()
            .then(response => {
                setOptions(response)
            })
            .catch((e) => {
                throw e
            })
    }, [])


    return (

        <sisfirContext.Provider value={{
            ordem, setOrdem, OS, setOS, options, equipes, setEquipes, dataOS, setDataOS
        }}>
            {children}
        </sisfirContext.Provider>
    )
}

