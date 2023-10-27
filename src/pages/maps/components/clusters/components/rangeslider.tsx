import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import useWindowSize from '../../../../../bundles/useWindowsSize'
import { addDays, calculateDaysDifference, convertDatesToMilliseconds, generateDateList, getCurrentDateSaoPauloCluster, subtractDays } from '../../../../maps/utils/utils'
import moment from 'moment'

/**
 * Interface para as propriedades do componente RangeSlider.
 */
interface RangeSliderProps {
    /**
     * Função de callback para lidar com a mudança do estado da data.
     */
    handleStateRangeDate: React.Dispatch<React.SetStateAction<number[]>>
}

/**
 * Componente RangeSlider.
 * 
 * Permite ao usuário selecionar um intervalo de datas através de um controle deslizante.
 * 
 * @param {RangeSliderProps} props - As propriedades do componente.
 * @returns {ReactElement} O elemento React do componente RangeSlider.
 */
const RangeSlider: React.FC<RangeSliderProps> = ({
    handleStateRangeDate
}) => {

    const currentDate = useMemo(() => {
        return getCurrentDateSaoPauloCluster()
    }, [])

    const [value, setValue] = useState<number[]>([0, 762])
    const [minValue, setMinValue] = useState<string>('18-03-2023')
    const [maxValue, setMaxValue] = useState<string>(currentDate)


    const { width } = useWindowSize(150)

    /**
     * Função de callback para lidar com a mudança do controle deslizante.
     * 
     * @param {Event} event - O evento do controle deslizante.
     * @param {number[] | number} newValue - O novo valor do controle deslizante.
     */
    const handleChange = useCallback((event: Event, newValue: number[] | number) => {
        const [init, end] = newValue as number[]
        setMinValue(addDays(init))
        setMaxValue(subtractDays(end))
        setValue(newValue as number[])
        handleStateRangeDate(convertDatesToMilliseconds(addDays(init), subtractDays(end)))
    }, [])


    return (
        <main>
            <div className='flex w-full'>
                <Box sx={{ width }}>
                    <Slider
                        getAriaLabel={() => 'Temperature range'}
                        value={value}
                        onChange={handleChange}
                        valueLabelDisplay="off"
                        min={0}
                        max={calculateDaysDifference()}
                    />
                </Box>
            </div>

            <div className='grid grid-cols-2 gap-x-9'>
                <div className='flex flex-col'>
                    <label>Início</label>
                    <input
                        type='text'
                        value={minValue}
                        disabled
                        className='border text-center h-8 rounded-lg outline-none'
                    ></input>
                </div>

                <div className='flex flex-col'>
                    <label>Término</label>
                    <input
                        type='text'
                        value={maxValue}
                        disabled
                        className='border text-center h-8 rounded-lg outline-none'
                    ></input>
                </div>
            </div>
        </main >
    )
}

export default RangeSlider