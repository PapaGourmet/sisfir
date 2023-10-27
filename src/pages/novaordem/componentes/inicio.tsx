import React, { useContext } from "react";
import { sisfirContext } from "../../../context/sisfircontext";

export const InicioComponent: React.FC = () => {
    const { setOrdem, ordem } = useContext(sisfirContext)

    const handleChange = (value: any) => {
        if (ordem) {
            setOrdem({ ...ordem, inicio: value })
        }
    }

    return (
        <div className="flex flex-col w-full">
            <label>Início</label>
            <input
                value={ordem.inicio ? ordem.inicio : ""}
                type="time"
                className="border rounded-lg p-2 outline-none"
                onChange={(item: any) => {
                    const { value } = item.target
                    handleChange(value)
                }}
            >
            </input>
        </div>
    )
}