import React, { useContext } from "react";
import { sisfirContext } from "../../../context/sisfircontext";

export const TipoComponent: React.FC = () => {
    const { setOrdem, ordem } = useContext(sisfirContext)

    const handleChange = (value: any) => {
        if (ordem) {
            setOrdem({ ...ordem, tipo: value })
        }
    }

    return (
        <div className="flex flex-col w-full">
            <label>TIPO</label>
            <select
                className="border h-10 rounded-lg p-2 outline-none"
                defaultValue={"tipo"}
                onChange={(item: any) => {
                    const { value } = item.target
                    handleChange(value)
                }}
            >
                <option className='text-slate-100' value="tipo" disabled>selecione ...</option>
                <option value={'ordinária'}>ordinária</option>
                <option value={'extraordinária'}>extraordinária</option>
            </select>
        </div>
    )
}