import React from "react";

const firebaseNAOConfig = {
  apiKey: import.meta.env.VITE_nao_apiKey,
  authDomain: import.meta.env.VITE_nao_authDomain,
  projectId: import.meta.env.VITE_nao_projectId,
  storageBucket: import.meta.env.VITE_nao_storageBucket,
  messagingSenderId: import.meta.env.VITE_nao_messagingSenderId,
  appId: import.meta.env.VITE_nao_appId,
  measurementId: import.meta.env.VITE_nao_measurementId
}

export default firebaseNAOConfig;