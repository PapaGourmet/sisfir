import Select from "react-select/dist/declarations/src/Select";
import IEmployee from "../../../../interfaces/iemployee";
import CreatableSelect from "react-select/creatable"
import makeAnimated from 'react-select/animated'

interface FiscaisProps {
    employeees: IEmployee[],
    setEquipe: (value: React.SetStateAction<IEmployee[]>) => void,
    showOrientar: boolean,
    setShowOrientar: (value: React.SetStateAction<boolean>) => void,
    refEquipe: React.MutableRefObject<undefined>,
    refData: React.MutableRefObject<undefined>
}

const FiscaisDisponivies: React.FC<FiscaisProps> = (
    {
        employeees,
        setEquipe,
        showOrientar,
        setShowOrientar,
        refData,
        refEquipe
    }
) => {

    const animatedComponents = makeAnimated()

    return (<div className="grid grid-cols-12 mx-8 gap-2">
        <label className="col-span-12" htmlFor="disponiveis">Fiscais disponíveis</label>

        <div className="col-span-10">
            <CreatableSelect
                //@ts-ignore
                ref={refEquipe}
                isMulti
                options={employeees}
                isClearable
                isSearchable
                isDisabled={false}
                isLoading={false}
                closeMenuOnSelect={false}
                components={animatedComponents}
                placeholder={"selecione ..."}
                onChange={(item) => {
                    const response: string[] = []
                    item.forEach((i: any) => {
                        response.push(i.value)
                    })

                    const iequipe: IEmployee[] = []

                    response.forEach((x: any) => {

                        const index = employeees.findIndex(y => y.name === x)
                        iequipe.push(employeees[index])
                    })

                    setEquipe(iequipe)
                }}
            />
        </div>

        <div className="col-span-2">
            <button
                type="button"
                className="bg-teal-900 hover:bg-teal-600 text-white text-1xl w-full h-9 rounded-md truncate"

                onClick={() => {
                    setShowOrientar(!showOrientar)
                }}
            >orientações</button>
        </div>
    </div>)
}

export default FiscaisDisponivies


