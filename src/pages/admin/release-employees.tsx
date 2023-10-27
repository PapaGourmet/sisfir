import { useEffect, useRef, useState } from "react"
import EmployeesTable from "./componentes/componentes/employeetables"

const Employees: React.FC = () => {
    const [amount, setAmount] = useState(5)
    const [name, setName] = useState<any>(null)
    const refSelect = useRef<HTMLSelectElement>(null)

    useEffect(() => {

        if (name && name.length > 0) {
            refSelect.current!.selectedIndex = 0
            return
        } else {
            setAmount(5)
            return
        }

    }, [name])

    return (
        <main>
            <div className="m-8">
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="">
                        <label>Registros</label>
                        <select
                            ref={refSelect}
                            disabled={!!name}
                            className="outline-none min-w-full border h-10 rounded-md p-1"
                            onChange={(event) => {
                                const { value } = event.target
                                setAmount(Number(value))
                            }}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <div>
                        <label>Filtro</label>
                        <input
                            className="p-2 outline-none border w-full h-10 rounded-md"
                            onChange={(event) => {
                                const { value } = event.target
                                setName(value)
                            }}
                        ></input>
                    </div>


                </div>

                <EmployeesTable amount={amount} name={name} setAmount={setAmount} />


            </div>
        </main>
    )
}

export default Employees