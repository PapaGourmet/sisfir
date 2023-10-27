import { useEffect, useRef, useState } from "react"
import SelectSegmentos from "./componentes/componentes/selectSegmentos"
import SelectUnidades from "./componentes/componentes/selectUnidades"
import SelectFunction from "./componentes/componentes/selectFunction"
import CheckoutGroup, { IDays } from "./componentes/componentes/groupchechouts"
import SubTitle from "../../bundles/subtitle"
import SaveEmployeeZodSchema from "./componentes/zods/zodschemaemployeesave"
import { uid as random } from "uid"
import IEmployee from "../../interfaces/iemployee"
import { ServiceEmployee } from "./componentes/ioc/create-employee/iserviceemployee"
import { FirestoreServiceEmployees } from "./componentes/ioc/create-employee/firestoreserviceemployee"
import { toast, ToastContainer } from "react-toastify"
import Loading from "../../bundles/loading/loading"
import { useLocation } from "react-router-dom"
const sevicefirestore = new FirestoreServiceEmployees()
const service = new ServiceEmployee(sevicefirestore)

interface CreateEmployeeProps {

}

const CreateEmployee: React.FC<CreateEmployeeProps> = ({ }) => {
    const location = useLocation()
    const [employees, setEmployees] = useState<IEmployee[]>(location.state && location.state.empregados)
    const [isLoading, setIsLoading] = useState(false)
    const [id, setId] = useState<string>()
    const [tipo, setTipo] = useState<string>()
    const [obs, setObs] = useState<string>("")
    const uidRef = useRef(localStorage.getItem('uid') || "")
    const [days, setDays] = useState<IDays>({
        mon: false, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false
    })

    const {
        register,
        handleSubmit,
        reset,
        errors } = SaveEmployeeZodSchema()

    const notify = (message: string) => toast(message,
        {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        })

    const handleSaveEmployee = async (data: any) => {
        const { name, registry, rule, type, unit } = data
        const uid = uidRef.current

        const status = true
        const { mon, tue, wed, thu, fri, sat, sun } = days

        const employee: IEmployee = {
            id, name, registry, rule: rule, type, unit, uid, mon, tue, wed, thu, fri, sat, sun, status, obs
        }

        setIsLoading(true)

        try {
            if (!!employees) {
                await service.updateEmployee(employee)
                setIsLoading(false)

            } else {
                await service.addEmployee(employee)
                setIsLoading(false)
                reset()
            }

            notify('Sucesso')



        } catch (err) {
            setIsLoading(false)
            console.log(err)
        }

    }

    useEffect(() => {
        if (!!employees?.length) {
            const [data] = employees
            const { type, unit, rule, registry, name, id } = data
            setTipo(type)
            reset({ type, unit, rule, registry, name })
            setId(id)
        } else {

            setId(random(10).toString())
        }
    }, [employees])



    return (
        <main>
            <SubTitle title={employees ? 'ATUALIZAR FUNCIONÁRIOS' : 'CADASTRAR FUNCIONÁRIOS'} />

            <form onSubmit={handleSubmit(handleSaveEmployee)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mx-4">
                    <div className="flex flex-col mt-3">
                        <label>Tipo</label>
                        <SelectSegmentos setTipo={setTipo} register={register} />
                        {errors.type && <span className="alerta">{errors.type.message}</span>}
                    </div>

                    <div className="flex flex-col mt-3">
                        <label>Unidade</label>
                        <SelectUnidades tipo={tipo} register={register} />
                        {errors.unit && <span className="alerta">{errors.unit.message}</span>}
                    </div>

                    <div className="flex flex-col mt-3">
                        <label>Função</label>
                        <SelectFunction register={register} />
                        {errors.rule && <span className="alerta">{errors.rule.message}</span>}
                    </div>

                    <div className="flex flex-col mt-3">
                        <label>Matrícula</label>
                        <input
                            type="number"
                            className="border w-full h-8 rounded-md outline-none pl-2"
                            {...register('registry')}
                        ></input>
                        {errors.registry && <span className="alerta">{errors.registry.message}</span>}
                    </div>

                </div>

                <div className="grid grid-cols-1 mx-4">

                    <div className="flex flex-col mt-3">
                        <label>Nome</label>
                        <input
                            type="text"
                            className="border w-full h-8 rounded-md outline-none pl-2"
                            {...register('name')}
                        ></input>
                        {errors.name && <span className="alerta">{errors.name.message}</span>}
                    </div>


                    <div className="flex flex-col mt-3">
                        <label>Observações</label>
                        <textarea
                            className="border w-full h-24 rounded-md outline-none pl-2"
                            onChange={(event) => {
                                const { value } = event.target
                                setObs(String(value))
                            }}
                        ></textarea>
                    </div>


                    <div className="flex flex-col mt-3">
                        <label>Dias da semana</label>
                        <CheckoutGroup setDays={setDays} days={days} />
                    </div>
                </div>

                <div className="flex grid-cols-1 items-center justify-center">
                    <div className="w-full mx-8 flex items-center justify-center mb-20 mt-3">
                        <button
                            type="submit"
                            className="bg-teal-900 hover:bg-teal-600 text-white w-20 h-20 rounded-full"
                            onClick={() => { }}
                        >
                            {employees ? 'atualizar' : 'salvar'}
                        </button>
                    </div>
                </div>
            </form>

            <ToastContainer />

            {isLoading && <div className='flex justify-center items-center'><Loading /></div>}

        </main>
    )
}

export default CreateEmployee