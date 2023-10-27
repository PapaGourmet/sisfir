import React, { useContext } from "react";
import { sisfirContext } from "../../../context/sisfircontext";

export const OrientacoesComponent: React.FC = () => {
    const { setOrdem, ordem } = useContext(sisfirContext)

    const handleChange = (value: any) => {
        if (ordem) {
            setOrdem({ ...ordem, orientacao: value })
        }
    }

    return (
        <div className="flex flex-col w-full">
            <label>Orientações</label>
            <textarea
                className="border rounded-lg p-2 outline-none"
                rows={10}
                value={ordem.orientacao ? ordem.orientacao : ""}
                onChange={(item: any) => {
                    const { value } = item.target
                    handleChange(value)
                }}
            >
            </textarea>
        </div>
    )
}