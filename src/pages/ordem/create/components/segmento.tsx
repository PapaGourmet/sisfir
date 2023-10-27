import React, { ReactElement, useCallback } from "react"
import CreatableSelect from "react-select/creatable"
import makeAnimated from 'react-select/animated'
import IEmployee from "../../../../interfaces/iemployee"
import { createOption } from "../util"
import { InsertItemOpcoes } from "../../../../services/servicesApi"

interface SegmentoProps {
    optSegmento: any,
    setShowMsg: (value: React.SetStateAction<boolean>) => void,
    setEmployees: (value: React.SetStateAction<IEmployee[]>) => void,
    setSegmentos: (value: React.SetStateAction<string[]>) => void,
    setOptSegmnto: (value: any) => void,
    setIsLoading: (value: React.SetStateAction<boolean>) => void,
    refEquipe: React.MutableRefObject<undefined>,
    refData: React.MutableRefObject<undefined>
}

const Segmento: React.FC<SegmentoProps> = ({
    optSegmento,
    setShowMsg,
    setEmployees,
    setSegmentos,
    setOptSegmnto,
    setIsLoading,
    refEquipe,
    refData
}) => {

    const animatedComponents = makeAnimated()

    const handleCreateSegmento = useCallback((inputValue: string) => {
        const newOption = createOption(inputValue)
        setOptSegmnto((prev: any) => [...prev, newOption])
        setIsLoading(true)
        InsertItemOpcoes('segmento', inputValue)
            .then(() => {
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
            })
    }, [])


    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-full mb-3 md:mb-0">
                <label htmlFor="segmento">Segmento</label>
                <CreatableSelect
                    isMulti
                    options={optSegmento}
                    isClearable
                    isSearchable
                    isDisabled={false}
                    isLoading={false}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    placeholder={"selecione ..."}
                    onCreateOption={handleCreateSegmento}

                    onChange={(item) => {
                        setShowMsg(false);
                        setEmployees([]);

                        //@ts-ignore
                        refEquipe!.current.clearValue();
                        //@ts-ignore
                        refData!.current.value = "";
                        const response: string[] = [];
                        item.forEach((i: any) => {
                            response.push(i.label)
                        })
                        setSegmentos(response);
                    }}
                />
            </div>
        </div>

    )
}

export default Segmento

