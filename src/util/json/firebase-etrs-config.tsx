import React from 'react';

const firebaseEtrsConfig = {
    apiKey:import.meta.env.VITE_etr_apiKey,
    authDomain: import.meta.env.VITE_etr_authDomain,
    projectId: import.meta.env.VITE_etr_projectId,
    storageBucket: import.meta.env.VITE_etr_storageBucket,
    messagingSenderId: import.meta.env.VITE_etr_messagingSenderId,
    appId: import.meta.env.VITE_etr_appId,
    measurementId:import.meta.env.VITE_etr_measurementId
}

export default firebaseEtrsConfig;