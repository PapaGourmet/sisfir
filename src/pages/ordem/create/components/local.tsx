import { useEffect, useState } from "react"

interface LocalProps {
    local: string,
    setOrientacao: (value: React.SetStateAction<string>) => void,
    setLocal: (value: any) => void
}

const Local: React.FC<LocalProps> = ({
    local,
    setOrientacao,
    setLocal
}) => {

    useEffect(() => {
        if (local) {
            const x = local
                .replace('(ZONA OESTE - Guaratiba, Rio de Janeiro - RJ, Brasil)', '(ZONA OESTE - Barra, Recreio, Jacarepaguá e Várgens)')
                .replace('(Santa Cruz, Rio de Janeiro - RJ, Brasil)', '(ZONA OESTE - Deodoro a Santa Cruz)')
            setLocal(x)
        }
    }, [local])


    return (
        <div className="flex grid-cols-1 items-center justify-center">
            <div className="w-full mx-8">
                <label htmlFor="motivacao">Local</label>
                <div className="input-group mb-3">
                    <textarea
                        className="form-control disabled:bg-blue-50"
                        id="motivacao"
                        disabled
                        rows={3}
                        value={local ? local : ""}
                        onChange={
                            (item) => {
                                const { value } = item.target
                                console.log(value)
                                setOrientacao(value)
                            }
                        }
                    ></textarea>
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={() => { setLocal(null) }}>limpar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Local