import React from "react";

interface ICacambas {
    client?: string;
    address?: string;
    number?: number;
    datetime: string;
    uid?: string;
    lat: number;
    lng: number;
    id: string;
    diff: number;
    color?: string;
    razaosocial?: string;
    status?: boolean;
}

export default ICacambas;