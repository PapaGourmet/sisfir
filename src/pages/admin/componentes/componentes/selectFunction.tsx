import { UseFormRegister } from "react-hook-form";

const funcs = [
    "interno", "fiscal", "supervisor", "controlador"
]

interface SelectFunctionProps {
    register: UseFormRegister<{
        type: string;
        name: string;
        unit: string;
        registry: string;
        obs?: string;
        rule: string;
    }>
}

const SelectFunction: React.FC<SelectFunctionProps> = ({ register }) => {
    return (<main>
        <select
            className="border w-full h-8 rounded-md outline-none pl-2"
            {...register("rule")}

        >
            <option></option>
            {funcs.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
            ))}
        </select>
    </main>)
}

export default SelectFunction