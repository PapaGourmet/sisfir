import React from "react";

interface IEmployee {
    unit: string;
    type: string;
    name: string;
    registry: string;
    rule: string;
    role?: string;
    uid?: string;
    id?: string;
    mon?: boolean;
    tue?: boolean;
    wed?: boolean;
    thu?: boolean;
    fri?: boolean;
    sat?: boolean;
    sun?: boolean;
    status?: boolean;
    obs?: string;
    label?: string;
    value?: string;
}

export default IEmployee;