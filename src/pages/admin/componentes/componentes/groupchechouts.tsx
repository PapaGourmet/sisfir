import { useCallback, useEffect, useState } from "react"
import { subtractDays } from "../../../maps/utils/utils"

export enum type {
    mon = 'mon',
    tue = 'tue',
    wed = 'wed',
    thu = 'thu',
    fri = 'fri',
    sat = 'sat',
    sun = 'sun'
}

export interface IDays {
    mon?: boolean,
    tue?: boolean,
    wed?: boolean,
    thu?: boolean,
    fri?: boolean,
    sat?: boolean,
    sun?: boolean
}
interface CheckoutGroupProps {
    setDays: React.Dispatch<React.SetStateAction<IDays>>,
    days: IDays
}

const CheckoutGroup: React.FC<CheckoutGroupProps> = ({ setDays, days }) => {

    interface checkboxProps {
        label: string,
        type: keyof IDays,
        setDays: React.Dispatch<React.SetStateAction<IDays>>,
        days: IDays
    }

    const CheckboxDays: React.FC<checkboxProps> = ({ label, type, setDays, days }) => {


        const handleCheckboxChange = useCallback((day: keyof IDays) => {
            setDays((prevDays) => ({
                ...prevDays,
                [day]: !prevDays[day]
            }));
        }, [])

        return (
            <div className="mx-2">
                <input type="checkbox"
                    checked={days[type] || false}
                    onChange={() => handleCheckboxChange(type)}
                ></input>
                <label className="ml-1">{label}</label>
            </div >
        )
    }

    return (
        <main>
            <div className="flex flex-col md:flex-row">
                <CheckboxDays label="seg" type={type.mon} days={days} setDays={setDays} />
                <CheckboxDays label="ter" type={type.tue} days={days} setDays={setDays} />
                <CheckboxDays label="qua" type={type.wed} days={days} setDays={setDays} />
                <CheckboxDays label="qui" type={type.thu} days={days} setDays={setDays} />
                <CheckboxDays label="sex" type={type.fri} days={days} setDays={setDays} />
                <CheckboxDays label="sab" type={type.sat} days={days} setDays={setDays} />
                <CheckboxDays label="dom" type={type.sun} days={days} setDays={setDays} />
            </div>
        </main>
    )
}

export default CheckoutGroup