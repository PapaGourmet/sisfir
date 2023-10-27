import { useState } from "react"
import { UseFormRegister } from "react-hook-form";

const units = [
    { tipo: "Lixo Zero", unidade: "Alpha" },
    { tipo: "Lixo Zero", unidade: "Bravo" },
    { tipo: "Lixo Zero", unidade: "Omega" },
    { tipo: "Grande Gerador", unidade: "Charlie" },
    { tipo: "Grande Gerador", unidade: "Delta" },
    { tipo: "Grande Gerador", unidade: "Echo" },
    { tipo: "Grande Gerador", unidade: "Omega" },
    { tipo: "Adminstrativo", unidade: "Omega" },
    { tipo: "Apreensão", unidade: "Omega" }
]

interface SelectUnidadesProps {
    tipo: string | undefined,
    register: UseFormRegister<{
        type: string;
        name: string;
        unit: string;
        registry: string;
        obs?: string;
        rule: string;
    }>
}

const SelectUnidades: React.FC<SelectUnidadesProps> = ({ tipo, register }) => {
    const [unidades, setUnidades] = useState<{ tipo: string, unidade: string }[]>(units)

    return (
        <main>
            <select
                className="border w-full h-8 rounded-md outline-none pl-2"
                {...register('unit')}

            >
                <option></option>
                {unidades
                    .filter(item => item.tipo === tipo)
                    .map((item) => (
                        <option key={item.unidade} value={item.unidade}>{item.unidade}</option>
                    ))}

            </select>

        </main>
    )
}

export default SelectUnidades