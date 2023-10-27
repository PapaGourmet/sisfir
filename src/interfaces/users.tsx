import React from 'react';

interface User {
    email: string;
    rules: string[];
    uid?: string;
    autorizada?: boolean;
    cnpj?: string;
    id?: string;
    razaosocial?: string;
    type?: string;
    nome?: string;
    matricula?: string;
    senha?: string
}

export default User;