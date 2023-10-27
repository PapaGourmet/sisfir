import React, { useContext } from "react";
import { sisfirContext } from "../../../context/sisfircontext";

export const RelatorComponent: React.FC = () => {
    const { setOrdem, ordem } = useContext(sisfirContext)

    const handleChange = (value: any) => {
        if (ordem) {
            setOrdem({ ...ordem, responsavel: value })
        }
    }


    return (
        <div className="flex flex-col w-full">
            <label>Relator</label>
            <input
                value={ordem.responsavel ? ordem.responsavel : ''}
                type="text"
                className="border rounded-lg p-2 outline-none"
                disabled
                onChange={(item: any) => {
                    const { value } = item.target
                    handleChange(value)
                }}
            >
            </input>
        </div>
    )
}