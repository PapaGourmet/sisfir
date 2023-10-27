import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'
import objectId from '../interfaces/objectId'
import IEmpresa from "../interfaces/iempresas"
import Location from "../interfaces/location"
import ICacambas from "../interfaces/icacambas"
import IOrdem from "../interfaces/iordem"
import User from "../interfaces/users"
import IClient from "../interfaces/iclient"
import IEmployee from "../interfaces/iemployee"
import IScript from "../interfaces/iscript"
import firebaseNAOConfig from '../util/firebase-nao-config'
import { collection, setDoc, doc, updateDoc, arrayUnion, getDocs, getDoc, DocumentData, arrayRemove, addDoc, deleteDoc, FieldValue, increment, query, where } from "firebase/firestore"
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage"
import { uid } from 'uid'
import moment from 'moment'
import IOptions from "../interfaces/ioptions"
import IOs from '../interfaces/OS'
import IDataEnterprise from '../interfaces/idataenterprise'
import IEmail from '../interfaces/iemail'
import IAcesso from '../interfaces/iacessos'
import { toPng } from "html-to-image"
import { IFirestoreEnvio } from '../types/types'
const app = initializeApp(firebaseNAOConfig, "NAO")
const db = getFirestore(app)
const storage = getStorage(app)
const URLNAO = 'https://fcz-cacambas-default-rtdb.firebaseio.com'
const URLNao = 'https://fcz-nao-default-rtdb.firebaseio.com'

const agora = moment()

const populate = async () => {
    const days = [
        { dia: "27-01-2023", semana: "sexta-feira", ordens: [] },
        { dia: "28-01-2023", semana: "sábado", ordens: [] },
        { dia: "29-01-2023", semana: "domingo", ordens: [] },
        { dia: "30-01-2023", semana: "segunda-feira", ordens: [] },
        { dia: "31-01-2023", semana: "terça-feira", ordens: [] },
        { dia: "01-02-2023", semana: "quarta-feira", ordens: [] },
        { dia: "02-02-2023", semana: "quinta-feira", ordens: [] },
        { dia: "03-02-2023", semana: "sexta-feira", ordens: [] },
        { dia: "04-02-2023", semana: "sábado", ordens: [] },
        { dia: "05-02-2023", semana: "domingo", ordens: [] },
        { dia: "06-02-2023", semana: "segunda-feira", ordens: [] },
        { dia: "07-02-2023", semana: "terça-feira", ordens: [] },
        { dia: "08-02-2023", semana: "quarta-feira", ordens: [] },
        { dia: "09-02-2023", semana: "quinta-feira", ordens: [] },
        { dia: "10-02-2023", semana: "sexta-feira", ordens: [] },
        { dia: "11-02-2023", semana: "sábado", ordens: [] },
        { dia: "12-02-2023", semana: "domingo", ordens: [] },
        { dia: "13-02-2023", semana: "segunda-feira", ordens: [] },
        { dia: "14-02-2023", semana: "terça-feira", ordens: [] },
        { dia: "15-02-2023", semana: "quarta-feira", ordens: [] },
        { dia: "16-02-2023", semana: "quinta-feira", ordens: [] },
        { dia: "17-02-2023", semana: "sexta-feira", ordens: [] },
        { dia: "18-02-2023", semana: "sábado", ordens: [] },
        { dia: "19-02-2023", semana: "domingo", ordens: [] },
        { dia: "20-02-2023", semana: "segunda-feira", ordens: [] },
        { dia: "21-02-2023", semana: "terça-feira", ordens: [] },
        { dia: "22-02-2023", semana: "quarta-feira", ordens: [] },
        { dia: "23-02-2023", semana: "quinta-feira", ordens: [] },
        { dia: "24-02-2023", semana: "sexta-feira", ordens: [] },
        { dia: "25-02-2023", semana: "sábado", ordens: [] },
        { dia: "26-02-2023", semana: "domingo", ordens: [] },
        { dia: "27-02-2023", semana: "segunda-feira", ordens: [] },
        { dia: "28-02-2023", semana: "terça-feira", ordens: [] },
        { dia: "01-03-2023", semana: "quarta-feira", ordens: [] },
        { dia: "02-03-2023", semana: "quinta-feira", ordens: [] },
        { dia: "03-03-2023", semana: "sexta-feira", ordens: [] },
        { dia: "04-03-2023", semana: "sábado", ordens: [] },
        { dia: "05-03-2023", semana: "domingo", ordens: [] },
        { dia: "06-03-2023", semana: "segunda-feira", ordens: [] },
        { dia: "07-03-2023", semana: "terça-feira", ordens: [] },
        { dia: "08-03-2023", semana: "quarta-feira", ordens: [] },
        { dia: "09-03-2023", semana: "quinta-feira", ordens: [] },
        { dia: "10-03-2023", semana: "sexta-feira", ordens: [] },
        { dia: "11-03-2023", semana: "sábado", ordens: [] },
        { dia: "12-03-2023", semana: "domingo", ordens: [] },
        { dia: "13-03-2023", semana: "segunda-feira", ordens: [] },
        { dia: "14-03-2023", semana: "terça-feira", ordens: [] },
        { dia: "15-03-2023", semana: "quarta-feira", ordens: [] },
        { dia: "16-03-2023", semana: "quinta-feira", ordens: [] },
        { dia: "17-03-2023", semana: "sexta-feira", ordens: [] },
        { dia: "18-03-2023", semana: "sábado", ordens: [] },
        { dia: "19-03-2023", semana: "domingo", ordens: [] },
        { dia: "20-03-2023", semana: "segunda-feira", ordens: [] },
        { dia: "21-03-2023", semana: "terça-feira", ordens: [] },
        { dia: "22-03-2023", semana: "quarta-feira", ordens: [] },
        { dia: "23-03-2023", semana: "quinta-feira", ordens: [] },
        { dia: "24-03-2023", semana: "sexta-feira", ordens: [] },
        { dia: "25-03-2023", semana: "sábado", ordens: [] },
        { dia: "26-03-2023", semana: "domingo", ordens: [] },
        { dia: "27-03-2023", semana: "segunda-feira", ordens: [] },
        { dia: "28-03-2023", semana: "terça-feira", ordens: [] },
        { dia: "29-03-2023", semana: "quarta-feira", ordens: [] },
        { dia: "30-03-2023", semana: "quinta-feira", ordens: [] },
        { dia: "31-03-2023", semana: "sexta-feira", ordens: [] },
        { dia: "01-04-2023", semana: "sábado", ordens: [] },
        { dia: "02-04-2023", semana: "domingo", ordens: [] },
        { dia: "03-04-2023", semana: "segunda-feira", ordens: [] },
        { dia: "04-04-2023", semana: "terça-feira", ordens: [] },
        { dia: "05-04-2023", semana: "quarta-feira", ordens: [] },
        { dia: "06-04-2023", semana: "quinta-feira", ordens: [] },
        { dia: "07-04-2023", semana: "sexta-feira", ordens: [] },
        { dia: "08-04-2023", semana: "sábado", ordens: [] },
        { dia: "09-04-2023", semana: "domingo", ordens: [] },
        { dia: "10-04-2023", semana: "segunda-feira", ordens: [] },
        { dia: "11-04-2023", semana: "terça-feira", ordens: [] },
        { dia: "12-04-2023", semana: "quarta-feira", ordens: [] },
        { dia: "13-04-2023", semana: "quinta-feira", ordens: [] },
        { dia: "14-04-2023", semana: "sexta-feira", ordens: [] },
        { dia: "15-04-2023", semana: "sábado", ordens: [] },
        { dia: "16-04-2023", semana: "domingo", ordens: [] },
        { dia: "17-04-2023", semana: "segunda-feira", ordens: [] },
        { dia: "18-04-2023", semana: "terça-feira", ordens: [] },
        { dia: "19-04-2023", semana: "quarta-feira", ordens: [] },
        { dia: "20-04-2023", semana: "quinta-feira", ordens: [] },
        { dia: "21-04-2023", semana: "sexta-feira", ordens: [] },
        { dia: "22-04-2023", semana: "sábado", ordens: [] },
        { dia: "23-04-2023", semana: "domingo", ordens: [] },
        { dia: "24-04-2023", semana: "segunda-feira", ordens: [] },
        { dia: "25-04-2023", semana: "terça-feira", ordens: [] },
        { dia: "26-04-2023", semana: "quarta-feira", ordens: [] },
        { dia: "27-04-2023", semana: "quinta-feira", ordens: [] },
        { dia: "28-04-2023", semana: "sexta-feira", ordens: [] },
        { dia: "29-04-2023", semana: "sábado", ordens: [] },
        { dia: "30-04-2023", semana: "domingo", ordens: [] },
        { dia: "01-05-2023", semana: "segunda-feira", ordens: [] },
        { dia: "02-05-2023", semana: "terça-feira", ordens: [] },
        { dia: "03-05-2023", semana: "quarta-feira", ordens: [] },
        { dia: "04-05-2023", semana: "quinta-feira", ordens: [] },
        { dia: "05-05-2023", semana: "sexta-feira", ordens: [] },
        { dia: "06-05-2023", semana: "sábado", ordens: [] },
        { dia: "07-05-2023", semana: "domingo", ordens: [] },
        { dia: "08-05-2023", semana: "segunda-feira", ordens: [] },
        { dia: "09-05-2023", semana: "terça-feira", ordens: [] },
        { dia: "10-05-2023", semana: "quarta-feira", ordens: [] },
        { dia: "11-05-2023", semana: "quinta-feira", ordens: [] },
        { dia: "12-05-2023", semana: "sexta-feira", ordens: [] },
        { dia: "13-05-2023", semana: "sábado", ordens: [] },
        { dia: "14-05-2023", semana: "domingo", ordens: [] },
        { dia: "15-05-2023", semana: "segunda-feira", ordens: [] },
        { dia: "16-05-2023", semana: "terça-feira", ordens: [] },
        { dia: "17-05-2023", semana: "quarta-feira", ordens: [] },
        { dia: "18-05-2023", semana: "quinta-feira", ordens: [] },
        { dia: "19-05-2023", semana: "sexta-feira", ordens: [] },
        { dia: "20-05-2023", semana: "sábado", ordens: [] },
        { dia: "21-05-2023", semana: "domingo", ordens: [] },
        { dia: "22-05-2023", semana: "segunda-feira", ordens: [] },
        { dia: "23-05-2023", semana: "terça-feira", ordens: [] },
        { dia: "24-05-2023", semana: "quarta-feira", ordens: [] },
        { dia: "25-05-2023", semana: "quinta-feira", ordens: [] },
        { dia: "26-05-2023", semana: "sexta-feira", ordens: [] },
        { dia: "27-05-2023", semana: "sábado", ordens: [] },
        { dia: "28-05-2023", semana: "domingo", ordens: [] },
        { dia: "29-05-2023", semana: "segunda-feira", ordens: [] },
        { dia: "30-05-2023", semana: "terça-feira", ordens: [] },
        { dia: "31-05-2023", semana: "quarta-feira", ordens: [] },
        { dia: "01-06-2023", semana: "quinta-feira", ordens: [] },
        { dia: "02-06-2023", semana: "sexta-feira", ordens: [] },
        { dia: "03-06-2023", semana: "sábado", ordens: [] },
        { dia: "04-06-2023", semana: "domingo", ordens: [] },
        { dia: "05-06-2023", semana: "segunda-feira", ordens: [] },
        { dia: "06-06-2023", semana: "terça-feira", ordens: [] },
        { dia: "07-06-2023", semana: "quarta-feira", ordens: [] },
        { dia: "08-06-2023", semana: "quinta-feira", ordens: [] },
        { dia: "09-06-2023", semana: "sexta-feira", ordens: [] },
        { dia: "10-06-2023", semana: "sábado", ordens: [] },
        { dia: "11-06-2023", semana: "domingo", ordens: [] },
        { dia: "12-06-2023", semana: "segunda-feira", ordens: [] },
        { dia: "13-06-2023", semana: "terça-feira", ordens: [] },
        { dia: "14-06-2023", semana: "quarta-feira", ordens: [] },
        { dia: "15-06-2023", semana: "quinta-feira", ordens: [] },
        { dia: "16-06-2023", semana: "sexta-feira", ordens: [] },
        { dia: "17-06-2023", semana: "sábado", ordens: [] },
        { dia: "18-06-2023", semana: "domingo", ordens: [] },
        { dia: "19-06-2023", semana: "segunda-feira", ordens: [] },
        { dia: "20-06-2023", semana: "terça-feira", ordens: [] },
        { dia: "21-06-2023", semana: "quarta-feira", ordens: [] },
        { dia: "22-06-2023", semana: "quinta-feira", ordens: [] },
        { dia: "23-06-2023", semana: "sexta-feira", ordens: [] },
        { dia: "24-06-2023", semana: "sábado", ordens: [] },
        { dia: "25-06-2023", semana: "domingo", ordens: [] },
        { dia: "26-06-2023", semana: "segunda-feira", ordens: [] },
        { dia: "27-06-2023", semana: "terça-feira", ordens: [] },
        { dia: "28-06-2023", semana: "quarta-feira", ordens: [] },
        { dia: "29-06-2023", semana: "quinta-feira", ordens: [] },
        { dia: "30-06-2023", semana: "sexta-feira", ordens: [] },
        { dia: "01-07-2023", semana: "sábado", ordens: [] },
        { dia: "02-07-2023", semana: "domingo", ordens: [] },
        { dia: "03-07-2023", semana: "segunda-feira", ordens: [] },
        { dia: "04-07-2023", semana: "terça-feira", ordens: [] },
        { dia: "05-07-2023", semana: "quarta-feira", ordens: [] },
        { dia: "06-07-2023", semana: "quinta-feira", ordens: [] },
        { dia: "07-07-2023", semana: "sexta-feira", ordens: [] },
        { dia: "08-07-2023", semana: "sábado", ordens: [] },
        { dia: "09-07-2023", semana: "domingo", ordens: [] },
        { dia: "10-07-2023", semana: "segunda-feira", ordens: [] },
        { dia: "11-07-2023", semana: "terça-feira", ordens: [] },
        { dia: "12-07-2023", semana: "quarta-feira", ordens: [] },
        { dia: "13-07-2023", semana: "quinta-feira", ordens: [] },
        { dia: "14-07-2023", semana: "sexta-feira", ordens: [] },
        { dia: "15-07-2023", semana: "sábado", ordens: [] },
        { dia: "16-07-2023", semana: "domingo", ordens: [] },
        { dia: "17-07-2023", semana: "segunda-feira", ordens: [] },
        { dia: "18-07-2023", semana: "terça-feira", ordens: [] },
        { dia: "19-07-2023", semana: "quarta-feira", ordens: [] },
        { dia: "20-07-2023", semana: "quinta-feira", ordens: [] },
        { dia: "21-07-2023", semana: "sexta-feira", ordens: [] },
        { dia: "22-07-2023", semana: "sábado", ordens: [] },
        { dia: "23-07-2023", semana: "domingo", ordens: [] },
        { dia: "24-07-2023", semana: "segunda-feira", ordens: [] },
        { dia: "25-07-2023", semana: "terça-feira", ordens: [] },
        { dia: "26-07-2023", semana: "quarta-feira", ordens: [] },
        { dia: "27-07-2023", semana: "quinta-feira", ordens: [] },
        { dia: "28-07-2023", semana: "sexta-feira", ordens: [] },
        { dia: "29-07-2023", semana: "sábado", ordens: [] },
        { dia: "30-07-2023", semana: "domingo", ordens: [] },
        { dia: "31-07-2023", semana: "segunda-feira", ordens: [] },
        { dia: "01-08-2023", semana: "terça-feira", ordens: [] },
        { dia: "02-08-2023", semana: "quarta-feira", ordens: [] },
        { dia: "03-08-2023", semana: "quinta-feira", ordens: [] },
        { dia: "04-08-2023", semana: "sexta-feira", ordens: [] },
        { dia: "05-08-2023", semana: "sábado", ordens: [] },
        { dia: "06-08-2023", semana: "domingo", ordens: [] },
        { dia: "07-08-2023", semana: "segunda-feira", ordens: [] },
        { dia: "08-08-2023", semana: "terça-feira", ordens: [] },
        { dia: "09-08-2023", semana: "quarta-feira", ordens: [] },
        { dia: "10-08-2023", semana: "quinta-feira", ordens: [] },
        { dia: "11-08-2023", semana: "sexta-feira", ordens: [] },
        { dia: "12-08-2023", semana: "sábado", ordens: [] },
        { dia: "13-08-2023", semana: "domingo", ordens: [] },
        { dia: "14-08-2023", semana: "segunda-feira", ordens: [] },
        { dia: "15-08-2023", semana: "terça-feira", ordens: [] },
        { dia: "16-08-2023", semana: "quarta-feira", ordens: [] },
        { dia: "17-08-2023", semana: "quinta-feira", ordens: [] },
        { dia: "18-08-2023", semana: "sexta-feira", ordens: [] },
        { dia: "19-08-2023", semana: "sábado", ordens: [] },
        { dia: "20-08-2023", semana: "domingo", ordens: [] },
        { dia: "21-08-2023", semana: "segunda-feira", ordens: [] },
        { dia: "22-08-2023", semana: "terça-feira", ordens: [] },
        { dia: "23-08-2023", semana: "quarta-feira", ordens: [] },
        { dia: "24-08-2023", semana: "quinta-feira", ordens: [] },
        { dia: "25-08-2023", semana: "sexta-feira", ordens: [] },
        { dia: "26-08-2023", semana: "sábado", ordens: [] },
        { dia: "27-08-2023", semana: "domingo", ordens: [] },
        { dia: "28-08-2023", semana: "segunda-feira", ordens: [] },
        { dia: "29-08-2023", semana: "terça-feira", ordens: [] },
        { dia: "30-08-2023", semana: "quarta-feira", ordens: [] },
        { dia: "31-08-2023", semana: "quinta-feira", ordens: [] },
        { dia: "01-09-2023", semana: "sexta-feira", ordens: [] },
        { dia: "02-09-2023", semana: "sábado", ordens: [] },
        { dia: "03-09-2023", semana: "domingo", ordens: [] },
        { dia: "04-09-2023", semana: "segunda-feira", ordens: [] },
        { dia: "05-09-2023", semana: "terça-feira", ordens: [] },
        { dia: "06-09-2023", semana: "quarta-feira", ordens: [] },
        { dia: "07-09-2023", semana: "quinta-feira", ordens: [] },
        { dia: "08-09-2023", semana: "sexta-feira", ordens: [] },
        { dia: "09-09-2023", semana: "sábado", ordens: [] },
        { dia: "10-09-2023", semana: "domingo", ordens: [] },
        { dia: "11-09-2023", semana: "segunda-feira", ordens: [] },
        { dia: "12-09-2023", semana: "terça-feira", ordens: [] },
        { dia: "13-09-2023", semana: "quarta-feira", ordens: [] },
        { dia: "14-09-2023", semana: "quinta-feira", ordens: [] },
        { dia: "15-09-2023", semana: "sexta-feira", ordens: [] },
        { dia: "16-09-2023", semana: "sábado", ordens: [] },
        { dia: "17-09-2023", semana: "domingo", ordens: [] },
        { dia: "18-09-2023", semana: "segunda-feira", ordens: [] },
        { dia: "19-09-2023", semana: "terça-feira", ordens: [] },
        { dia: "20-09-2023", semana: "quarta-feira", ordens: [] },
        { dia: "21-09-2023", semana: "quinta-feira", ordens: [] },
        { dia: "22-09-2023", semana: "sexta-feira", ordens: [] },
        { dia: "23-09-2023", semana: "sábado", ordens: [] },
        { dia: "24-09-2023", semana: "domingo", ordens: [] },
        { dia: "25-09-2023", semana: "segunda-feira", ordens: [] },
        { dia: "26-09-2023", semana: "terça-feira", ordens: [] },
        { dia: "27-09-2023", semana: "quarta-feira", ordens: [] },
        { dia: "28-09-2023", semana: "quinta-feira", ordens: [] },
        { dia: "29-09-2023", semana: "sexta-feira", ordens: [] },
        { dia: "30-09-2023", semana: "sábado", ordens: [] },
        { dia: "01-10-2023", semana: "domingo", ordens: [] },
        { dia: "02-10-2023", semana: "segunda-feira", ordens: [] },
        { dia: "03-10-2023", semana: "terça-feira", ordens: [] },
        { dia: "04-10-2023", semana: "quarta-feira", ordens: [] },
        { dia: "05-10-2023", semana: "quinta-feira", ordens: [] },
        { dia: "06-10-2023", semana: "sexta-feira", ordens: [] },
        { dia: "07-10-2023", semana: "sábado", ordens: [] },
        { dia: "08-10-2023", semana: "domingo", ordens: [] },
        { dia: "09-10-2023", semana: "segunda-feira", ordens: [] },
        { dia: "10-10-2023", semana: "terça-feira", ordens: [] },
        { dia: "11-10-2023", semana: "quarta-feira", ordens: [] },
        { dia: "12-10-2023", semana: "quinta-feira", ordens: [] },
        { dia: "13-10-2023", semana: "sexta-feira", ordens: [] },
        { dia: "14-10-2023", semana: "sábado", ordens: [] },
        { dia: "15-10-2023", semana: "domingo", ordens: [] },
        { dia: "16-10-2023", semana: "segunda-feira", ordens: [] },
        { dia: "17-10-2023", semana: "terça-feira", ordens: [] },
        { dia: "18-10-2023", semana: "quarta-feira", ordens: [] },
        { dia: "19-10-2023", semana: "quinta-feira", ordens: [] },
        { dia: "20-10-2023", semana: "sexta-feira", ordens: [] },
        { dia: "21-10-2023", semana: "sábado", ordens: [] },
        { dia: "22-10-2023", semana: "domingo", ordens: [] },
        { dia: "23-10-2023", semana: "segunda-feira", ordens: [] },
        { dia: "24-10-2023", semana: "terça-feira", ordens: [] },
        { dia: "25-10-2023", semana: "quarta-feira", ordens: [] },
        { dia: "26-10-2023", semana: "quinta-feira", ordens: [] },
        { dia: "27-10-2023", semana: "sexta-feira", ordens: [] },
        { dia: "28-10-2023", semana: "sábado", ordens: [] },
        { dia: "29-10-2023", semana: "domingo", ordens: [] },
        { dia: "30-10-2023", semana: "segunda-feira", ordens: [] },
        { dia: "31-10-2023", semana: "terça-feira", ordens: [] },
        { dia: "01-11-2023", semana: "quarta-feira", ordens: [] },
        { dia: "02-11-2023", semana: "quinta-feira", ordens: [] },
        { dia: "03-11-2023", semana: "sexta-feira", ordens: [] },
        { dia: "04-11-2023", semana: "sábado", ordens: [] },
        { dia: "05-11-2023", semana: "domingo", ordens: [] },
        { dia: "06-11-2023", semana: "segunda-feira", ordens: [] },
        { dia: "07-11-2023", semana: "terça-feira", ordens: [] },
        { dia: "08-11-2023", semana: "quarta-feira", ordens: [] },
        { dia: "09-11-2023", semana: "quinta-feira", ordens: [] },
        { dia: "10-11-2023", semana: "sexta-feira", ordens: [] },
        { dia: "11-11-2023", semana: "sábado", ordens: [] },
        { dia: "12-11-2023", semana: "domingo", ordens: [] },
        { dia: "13-11-2023", semana: "segunda-feira", ordens: [] },
        { dia: "14-11-2023", semana: "terça-feira", ordens: [] },
        { dia: "15-11-2023", semana: "quarta-feira", ordens: [] },
        { dia: "16-11-2023", semana: "quinta-feira", ordens: [] },
        { dia: "17-11-2023", semana: "sexta-feira", ordens: [] },
        { dia: "18-11-2023", semana: "sábado", ordens: [] },
        { dia: "19-11-2023", semana: "domingo", ordens: [] },
        { dia: "20-11-2023", semana: "segunda-feira", ordens: [] },
        { dia: "21-11-2023", semana: "terça-feira", ordens: [] },
        { dia: "22-11-2023", semana: "quarta-feira", ordens: [] },
        { dia: "23-11-2023", semana: "quinta-feira", ordens: [] },
        { dia: "24-11-2023", semana: "sexta-feira", ordens: [] },
        { dia: "25-11-2023", semana: "sábado", ordens: [] },
        { dia: "26-11-2023", semana: "domingo", ordens: [] },
        { dia: "27-11-2023", semana: "segunda-feira", ordens: [] },
        { dia: "28-11-2023", semana: "terça-feira", ordens: [] },
        { dia: "29-11-2023", semana: "quarta-feira", ordens: [] },
        { dia: "30-11-2023", semana: "quinta-feira", ordens: [] },
        { dia: "01-12-2023", semana: "sexta-feira", ordens: [] },
        { dia: "02-12-2023", semana: "sábado", ordens: [] },
        { dia: "03-12-2023", semana: "domingo", ordens: [] },
        { dia: "04-12-2023", semana: "segunda-feira", ordens: [] },
        { dia: "05-12-2023", semana: "terça-feira", ordens: [] },
        { dia: "06-12-2023", semana: "quarta-feira", ordens: [] },
        { dia: "07-12-2023", semana: "quinta-feira", ordens: [] },
        { dia: "08-12-2023", semana: "sexta-feira", ordens: [] },
        { dia: "09-12-2023", semana: "sábado", ordens: [] },
        { dia: "10-12-2023", semana: "domingo", ordens: [] },
        { dia: "11-12-2023", semana: "segunda-feira", ordens: [] },
        { dia: "12-12-2023", semana: "terça-feira", ordens: [] },
        { dia: "13-12-2023", semana: "quarta-feira", ordens: [] },
        { dia: "14-12-2023", semana: "quinta-feira", ordens: [] },
        { dia: "15-12-2023", semana: "sexta-feira", ordens: [] },
        { dia: "16-12-2023", semana: "sábado", ordens: [] },
        { dia: "17-12-2023", semana: "domingo", ordens: [] },
        { dia: "18-12-2023", semana: "segunda-feira", ordens: [] },
        { dia: "19-12-2023", semana: "terça-feira", ordens: [] },
        { dia: "20-12-2023", semana: "quarta-feira", ordens: [] },
        { dia: "21-12-2023", semana: "quinta-feira", ordens: [] },
        { dia: "22-12-2023", semana: "sexta-feira", ordens: [] },
        { dia: "23-12-2023", semana: "sábado", ordens: [] },
        { dia: "24-12-2023", semana: "domingo", ordens: [] },
        { dia: "25-12-2023", semana: "segunda-feira", ordens: [] },
        { dia: "26-12-2023", semana: "terça-feira", ordens: [] },
        { dia: "27-12-2023", semana: "quarta-feira", ordens: [] },
        { dia: "28-12-2023", semana: "quinta-feira", ordens: [] },
        { dia: "29-12-2023", semana: "sexta-feira", ordens: [] },
        { dia: "30-12-2023", semana: "sábado", ordens: [] },
        { dia: "31-12-2023", semana: "domingo", ordens: [] },
        { dia: "01-01-2024", semana: "segunda-feira", ordens: [] },
        { dia: "02-01-2024", semana: "terça-feira", ordens: [] },
        { dia: "03-01-2024", semana: "quarta-feira", ordens: [] },
        { dia: "04-01-2024", semana: "quinta-feira", ordens: [] },
        { dia: "05-01-2024", semana: "sexta-feira", ordens: [] },
        { dia: "06-01-2024", semana: "sábado", ordens: [] },
        { dia: "07-01-2024", semana: "domingo", ordens: [] },
        { dia: "08-01-2024", semana: "segunda-feira", ordens: [] },
        { dia: "09-01-2024", semana: "terça-feira", ordens: [] },
        { dia: "10-01-2024", semana: "quarta-feira", ordens: [] },
        { dia: "11-01-2024", semana: "quinta-feira", ordens: [] },
        { dia: "12-01-2024", semana: "sexta-feira", ordens: [] },
        { dia: "13-01-2024", semana: "sábado", ordens: [] },
        { dia: "14-01-2024", semana: "domingo", ordens: [] },
        { dia: "15-01-2024", semana: "segunda-feira", ordens: [] },
        { dia: "16-01-2024", semana: "terça-feira", ordens: [] },
        { dia: "17-01-2024", semana: "quarta-feira", ordens: [] },
        { dia: "18-01-2024", semana: "quinta-feira", ordens: [] },
        { dia: "19-01-2024", semana: "sexta-feira", ordens: [] },
        { dia: "20-01-2024", semana: "sábado", ordens: [] },
        { dia: "21-01-2024", semana: "domingo", ordens: [] },
        { dia: "22-01-2024", semana: "segunda-feira", ordens: [] },
        { dia: "23-01-2024", semana: "terça-feira", ordens: [] },
        { dia: "24-01-2024", semana: "quarta-feira", ordens: [] },
        { dia: "25-01-2024", semana: "quinta-feira", ordens: [] },
        { dia: "26-01-2024", semana: "sexta-feira", ordens: [] },
        { dia: "27-01-2024", semana: "sábado", ordens: [] },
        { dia: "28-01-2024", semana: "domingo", ordens: [] },
        { dia: "29-01-2024", semana: "segunda-feira", ordens: [] },
        { dia: "30-01-2024", semana: "terça-feira", ordens: [] },
        { dia: "31-01-2024", semana: "quarta-feira", ordens: [] },
        { dia: "01-02-2024", semana: "quinta-feira", ordens: [] },
        { dia: "02-02-2024", semana: "sexta-feira", ordens: [] },
        { dia: "03-02-2024", semana: "sábado", ordens: [] },
        { dia: "04-02-2024", semana: "domingo", ordens: [] },
        { dia: "05-02-2024", semana: "segunda-feira", ordens: [] },
        { dia: "06-02-2024", semana: "terça-feira", ordens: [] },
        { dia: "07-02-2024", semana: "quarta-feira", ordens: [] },
        { dia: "08-02-2024", semana: "quinta-feira", ordens: [] },
        { dia: "09-02-2024", semana: "sexta-feira", ordens: [] },
        { dia: "10-02-2024", semana: "sábado", ordens: [] },
        { dia: "11-02-2024", semana: "domingo", ordens: [] },
        { dia: "12-02-2024", semana: "segunda-feira", ordens: [] },
        { dia: "13-02-2024", semana: "terça-feira", ordens: [] },
        { dia: "14-02-2024", semana: "quarta-feira", ordens: [] },
        { dia: "15-02-2024", semana: "quinta-feira", ordens: [] },
        { dia: "16-02-2024", semana: "sexta-feira", ordens: [] },
        { dia: "17-02-2024", semana: "sábado", ordens: [] },
        { dia: "18-02-2024", semana: "domingo", ordens: [] },
        { dia: "19-02-2024", semana: "segunda-feira", ordens: [] },
        { dia: "20-02-2024", semana: "terça-feira", ordens: [] },
        { dia: "21-02-2024", semana: "quarta-feira", ordens: [] },
        { dia: "22-02-2024", semana: "quinta-feira", ordens: [] },
        { dia: "23-02-2024", semana: "sexta-feira", ordens: [] },
        { dia: "24-02-2024", semana: "sábado", ordens: [] },
        { dia: "25-02-2024", semana: "domingo", ordens: [] },
        { dia: "26-02-2024", semana: "segunda-feira", ordens: [] },
        { dia: "27-02-2024", semana: "terça-feira", ordens: [] },
        { dia: "28-02-2024", semana: "quarta-feira", ordens: [] },
        { dia: "29-02-2024", semana: "quinta-feira", ordens: [] },
        { dia: "01-03-2024", semana: "sexta-feira", ordens: [] },
        { dia: "02-03-2024", semana: "sábado", ordens: [] },
        { dia: "03-03-2024", semana: "domingo", ordens: [] },
        { dia: "04-03-2024", semana: "segunda-feira", ordens: [] },
        { dia: "05-03-2024", semana: "terça-feira", ordens: [] },
        { dia: "06-03-2024", semana: "quarta-feira", ordens: [] },
        { dia: "07-03-2024", semana: "quinta-feira", ordens: [] },
        { dia: "08-03-2024", semana: "sexta-feira", ordens: [] },
        { dia: "09-03-2024", semana: "sábado", ordens: [] },
        { dia: "10-03-2024", semana: "domingo", ordens: [] },
        { dia: "11-03-2024", semana: "segunda-feira", ordens: [] },
        { dia: "12-03-2024", semana: "terça-feira", ordens: [] },
        { dia: "13-03-2024", semana: "quarta-feira", ordens: [] },
        { dia: "14-03-2024", semana: "quinta-feira", ordens: [] },
        { dia: "15-03-2024", semana: "sexta-feira", ordens: [] },
        { dia: "16-03-2024", semana: "sábado", ordens: [] },
        { dia: "17-03-2024", semana: "domingo", ordens: [] },
        { dia: "18-03-2024", semana: "segunda-feira", ordens: [] },
        { dia: "19-03-2024", semana: "terça-feira", ordens: [] },
        { dia: "20-03-2024", semana: "quarta-feira", ordens: [] },
        { dia: "21-03-2024", semana: "quinta-feira", ordens: [] },
        { dia: "22-03-2024", semana: "sexta-feira", ordens: [] },
        { dia: "23-03-2024", semana: "sábado", ordens: [] },
        { dia: "24-03-2024", semana: "domingo", ordens: [] },
        { dia: "25-03-2024", semana: "segunda-feira", ordens: [] },
        { dia: "26-03-2024", semana: "terça-feira", ordens: [] },
        { dia: "27-03-2024", semana: "quarta-feira", ordens: [] },
        { dia: "28-03-2024", semana: "quinta-feira", ordens: [] },
        { dia: "29-03-2024", semana: "sexta-feira", ordens: [] },
        { dia: "30-03-2024", semana: "sábado", ordens: [] },
        { dia: "31-03-2024", semana: "domingo", ordens: [] },
        { dia: "01-04-2024", semana: "segunda-feira", ordens: [] },
        { dia: "02-04-2024", semana: "terça-feira", ordens: [] },
        { dia: "03-04-2024", semana: "quarta-feira", ordens: [] },
        { dia: "04-04-2024", semana: "quinta-feira", ordens: [] },
        { dia: "05-04-2024", semana: "sexta-feira", ordens: [] },
        { dia: "06-04-2024", semana: "sábado", ordens: [] },
        { dia: "07-04-2024", semana: "domingo", ordens: [] },
        { dia: "08-04-2024", semana: "segunda-feira", ordens: [] },
        { dia: "09-04-2024", semana: "terça-feira", ordens: [] },
        { dia: "10-04-2024", semana: "quarta-feira", ordens: [] },
        { dia: "11-04-2024", semana: "quinta-feira", ordens: [] },
        { dia: "12-04-2024", semana: "sexta-feira", ordens: [] },
        { dia: "13-04-2024", semana: "sábado", ordens: [] },
        { dia: "14-04-2024", semana: "domingo", ordens: [] },
        { dia: "15-04-2024", semana: "segunda-feira", ordens: [] },
        { dia: "16-04-2024", semana: "terça-feira", ordens: [] },
        { dia: "17-04-2024", semana: "quarta-feira", ordens: [] },
        { dia: "18-04-2024", semana: "quinta-feira", ordens: [] },
        { dia: "19-04-2024", semana: "sexta-feira", ordens: [] },
        { dia: "20-04-2024", semana: "sábado", ordens: [] },
        { dia: "21-04-2024", semana: "domingo", ordens: [] },
        { dia: "22-04-2024", semana: "segunda-feira", ordens: [] },
        { dia: "23-04-2024", semana: "terça-feira", ordens: [] },
        { dia: "24-04-2024", semana: "quarta-feira", ordens: [] },
        { dia: "25-04-2024", semana: "quinta-feira", ordens: [] },
        { dia: "26-04-2024", semana: "sexta-feira", ordens: [] },
        { dia: "27-04-2024", semana: "sábado", ordens: [] },
        { dia: "28-04-2024", semana: "domingo", ordens: [] },
        { dia: "29-04-2024", semana: "segunda-feira", ordens: [] },
        { dia: "30-04-2024", semana: "terça-feira", ordens: [] },
        { dia: "01-05-2024", semana: "quarta-feira", ordens: [] },
        { dia: "02-05-2024", semana: "quinta-feira", ordens: [] },
        { dia: "03-05-2024", semana: "sexta-feira", ordens: [] },
        { dia: "04-05-2024", semana: "sábado", ordens: [] },
        { dia: "05-05-2024", semana: "domingo", ordens: [] },
        { dia: "06-05-2024", semana: "segunda-feira", ordens: [] },
        { dia: "07-05-2024", semana: "terça-feira", ordens: [] },
        { dia: "08-05-2024", semana: "quarta-feira", ordens: [] },
        { dia: "09-05-2024", semana: "quinta-feira", ordens: [] },
        { dia: "10-05-2024", semana: "sexta-feira", ordens: [] },
        { dia: "11-05-2024", semana: "sábado", ordens: [] },
        { dia: "12-05-2024", semana: "domingo", ordens: [] },
        { dia: "13-05-2024", semana: "segunda-feira", ordens: [] },
        { dia: "14-05-2024", semana: "terça-feira", ordens: [] },
        { dia: "15-05-2024", semana: "quarta-feira", ordens: [] },
        { dia: "16-05-2024", semana: "quinta-feira", ordens: [] },
        { dia: "17-05-2024", semana: "sexta-feira", ordens: [] },
        { dia: "18-05-2024", semana: "sábado", ordens: [] },
        { dia: "19-05-2024", semana: "domingo", ordens: [] },
        { dia: "20-05-2024", semana: "segunda-feira", ordens: [] },
        { dia: "21-05-2024", semana: "terça-feira", ordens: [] },
        { dia: "22-05-2024", semana: "quarta-feira", ordens: [] },
        { dia: "23-05-2024", semana: "quinta-feira", ordens: [] },
        { dia: "24-05-2024", semana: "sexta-feira", ordens: [] },
        { dia: "25-05-2024", semana: "sábado", ordens: [] },
        { dia: "26-05-2024", semana: "domingo", ordens: [] },
        { dia: "27-05-2024", semana: "segunda-feira", ordens: [] },
        { dia: "28-05-2024", semana: "terça-feira", ordens: [] },
        { dia: "29-05-2024", semana: "quarta-feira", ordens: [] },
        { dia: "30-05-2024", semana: "quinta-feira", ordens: [] },
        { dia: "31-05-2024", semana: "sexta-feira", ordens: [] },
        { dia: "01-06-2024", semana: "sábado", ordens: [] },
        { dia: "02-06-2024", semana: "domingo", ordens: [] },
        { dia: "03-06-2024", semana: "segunda-feira", ordens: [] },
        { dia: "04-06-2024", semana: "terça-feira", ordens: [] },
        { dia: "05-06-2024", semana: "quarta-feira", ordens: [] },
        { dia: "06-06-2024", semana: "quinta-feira", ordens: [] },
        { dia: "07-06-2024", semana: "sexta-feira", ordens: [] },
        { dia: "08-06-2024", semana: "sábado", ordens: [] },
        { dia: "09-06-2024", semana: "domingo", ordens: [] },
        { dia: "10-06-2024", semana: "segunda-feira", ordens: [] },
        { dia: "11-06-2024", semana: "terça-feira", ordens: [] },
        { dia: "12-06-2024", semana: "quarta-feira", ordens: [] },
        { dia: "13-06-2024", semana: "quinta-feira", ordens: [] },
        { dia: "14-06-2024", semana: "sexta-feira", ordens: [] },
        { dia: "15-06-2024", semana: "sábado", ordens: [] },
        { dia: "16-06-2024", semana: "domingo", ordens: [] },
        { dia: "17-06-2024", semana: "segunda-feira", ordens: [] },
        { dia: "18-06-2024", semana: "terça-feira", ordens: [] },
        { dia: "19-06-2024", semana: "quarta-feira", ordens: [] },
        { dia: "20-06-2024", semana: "quinta-feira", ordens: [] },
        { dia: "21-06-2024", semana: "sexta-feira", ordens: [] },
        { dia: "22-06-2024", semana: "sábado", ordens: [] },
        { dia: "23-06-2024", semana: "domingo", ordens: [] },
        { dia: "24-06-2024", semana: "segunda-feira", ordens: [] },
        { dia: "25-06-2024", semana: "terça-feira", ordens: [] },
        { dia: "26-06-2024", semana: "quarta-feira", ordens: [] },
        { dia: "27-06-2024", semana: "quinta-feira", ordens: [] },
        { dia: "28-06-2024", semana: "sexta-feira", ordens: [] },
        { dia: "29-06-2024", semana: "sábado", ordens: [] },
        { dia: "30-06-2024", semana: "domingo", ordens: [] },
        { dia: "01-07-2024", semana: "segunda-feira", ordens: [] },
        { dia: "02-07-2024", semana: "terça-feira", ordens: [] },
        { dia: "03-07-2024", semana: "quarta-feira", ordens: [] },
        { dia: "04-07-2024", semana: "quinta-feira", ordens: [] },
        { dia: "05-07-2024", semana: "sexta-feira", ordens: [] },
        { dia: "06-07-2024", semana: "sábado", ordens: [] },
        { dia: "07-07-2024", semana: "domingo", ordens: [] },
        { dia: "08-07-2024", semana: "segunda-feira", ordens: [] },
        { dia: "09-07-2024", semana: "terça-feira", ordens: [] },
        { dia: "10-07-2024", semana: "quarta-feira", ordens: [] },
        { dia: "11-07-2024", semana: "quinta-feira", ordens: [] },
        { dia: "12-07-2024", semana: "sexta-feira", ordens: [] },
        { dia: "13-07-2024", semana: "sábado", ordens: [] },
        { dia: "14-07-2024", semana: "domingo", ordens: [] },
        { dia: "15-07-2024", semana: "segunda-feira", ordens: [] },
        { dia: "16-07-2024", semana: "terça-feira", ordens: [] },
        { dia: "17-07-2024", semana: "quarta-feira", ordens: [] },
        { dia: "18-07-2024", semana: "quinta-feira", ordens: [] },
        { dia: "19-07-2024", semana: "sexta-feira", ordens: [] },
        { dia: "20-07-2024", semana: "sábado", ordens: [] },
        { dia: "21-07-2024", semana: "domingo", ordens: [] },
        { dia: "22-07-2024", semana: "segunda-feira", ordens: [] },
        { dia: "23-07-2024", semana: "terça-feira", ordens: [] },
        { dia: "24-07-2024", semana: "quarta-feira", ordens: [] },
        { dia: "25-07-2024", semana: "quinta-feira", ordens: [] },
        { dia: "26-07-2024", semana: "sexta-feira", ordens: [] },
        { dia: "27-07-2024", semana: "sábado", ordens: [] },
        { dia: "28-07-2024", semana: "domingo", ordens: [] },
        { dia: "29-07-2024", semana: "segunda-feira", ordens: [] },
        { dia: "30-07-2024", semana: "terça-feira", ordens: [] },
        { dia: "31-07-2024", semana: "quarta-feira", ordens: [] },
        { dia: "01-08-2024", semana: "quinta-feira", ordens: [] },
        { dia: "02-08-2024", semana: "sexta-feira", ordens: [] },
        { dia: "03-08-2024", semana: "sábado", ordens: [] },
        { dia: "04-08-2024", semana: "domingo", ordens: [] },
        { dia: "05-08-2024", semana: "segunda-feira", ordens: [] },
        { dia: "06-08-2024", semana: "terça-feira", ordens: [] },
        { dia: "07-08-2024", semana: "quarta-feira", ordens: [] },
        { dia: "08-08-2024", semana: "quinta-feira", ordens: [] },
        { dia: "09-08-2024", semana: "sexta-feira", ordens: [] },
        { dia: "10-08-2024", semana: "sábado", ordens: [] },
        { dia: "11-08-2024", semana: "domingo", ordens: [] },
        { dia: "12-08-2024", semana: "segunda-feira", ordens: [] },
        { dia: "13-08-2024", semana: "terça-feira", ordens: [] },
        { dia: "14-08-2024", semana: "quarta-feira", ordens: [] },
        { dia: "15-08-2024", semana: "quinta-feira", ordens: [] },
        { dia: "16-08-2024", semana: "sexta-feira", ordens: [] },
        { dia: "17-08-2024", semana: "sábado", ordens: [] },
        { dia: "18-08-2024", semana: "domingo", ordens: [] },
        { dia: "19-08-2024", semana: "segunda-feira", ordens: [] },
        { dia: "20-08-2024", semana: "terça-feira", ordens: [] },
        { dia: "21-08-2024", semana: "quarta-feira", ordens: [] },
        { dia: "22-08-2024", semana: "quinta-feira", ordens: [] },
        { dia: "23-08-2024", semana: "sexta-feira", ordens: [] },
        { dia: "24-08-2024", semana: "sábado", ordens: [] },
        { dia: "25-08-2024", semana: "domingo", ordens: [] },
        { dia: "26-08-2024", semana: "segunda-feira", ordens: [] },
        { dia: "27-08-2024", semana: "terça-feira", ordens: [] },
        { dia: "28-08-2024", semana: "quarta-feira", ordens: [] },
        { dia: "29-08-2024", semana: "quinta-feira", ordens: [] },
        { dia: "30-08-2024", semana: "sexta-feira", ordens: [] },
        { dia: "31-08-2024", semana: "sábado", ordens: [] },
        { dia: "01-09-2024", semana: "domingo", ordens: [] },
        { dia: "02-09-2024", semana: "segunda-feira", ordens: [] },
        { dia: "03-09-2024", semana: "terça-feira", ordens: [] },
        { dia: "04-09-2024", semana: "quarta-feira", ordens: [] },
        { dia: "05-09-2024", semana: "quinta-feira", ordens: [] },
        { dia: "06-09-2024", semana: "sexta-feira", ordens: [] },
        { dia: "07-09-2024", semana: "sábado", ordens: [] },
        { dia: "08-09-2024", semana: "domingo", ordens: [] },
        { dia: "09-09-2024", semana: "segunda-feira", ordens: [] },
        { dia: "10-09-2024", semana: "terça-feira", ordens: [] },
        { dia: "11-09-2024", semana: "quarta-feira", ordens: [] },
        { dia: "12-09-2024", semana: "quinta-feira", ordens: [] },
        { dia: "13-09-2024", semana: "sexta-feira", ordens: [] },
        { dia: "14-09-2024", semana: "sábado", ordens: [] },
        { dia: "15-09-2024", semana: "domingo", ordens: [] },
        { dia: "16-09-2024", semana: "segunda-feira", ordens: [] },
        { dia: "17-09-2024", semana: "terça-feira", ordens: [] },
        { dia: "18-09-2024", semana: "quarta-feira", ordens: [] },
        { dia: "19-09-2024", semana: "quinta-feira", ordens: [] },
        { dia: "20-09-2024", semana: "sexta-feira", ordens: [] },
        { dia: "21-09-2024", semana: "sábado", ordens: [] },
        { dia: "22-09-2024", semana: "domingo", ordens: [] },
        { dia: "23-09-2024", semana: "segunda-feira", ordens: [] },
        { dia: "24-09-2024", semana: "terça-feira", ordens: [] },
        { dia: "25-09-2024", semana: "quarta-feira", ordens: [] },
        { dia: "26-09-2024", semana: "quinta-feira", ordens: [] },
        { dia: "27-09-2024", semana: "sexta-feira", ordens: [] },
        { dia: "28-09-2024", semana: "sábado", ordens: [] },
        { dia: "29-09-2024", semana: "domingo", ordens: [] },
        { dia: "30-09-2024", semana: "segunda-feira", ordens: [] },
        { dia: "01-10-2024", semana: "terça-feira", ordens: [] },
        { dia: "02-10-2024", semana: "quarta-feira", ordens: [] },
        { dia: "03-10-2024", semana: "quinta-feira", ordens: [] },
        { dia: "04-10-2024", semana: "sexta-feira", ordens: [] },
        { dia: "05-10-2024", semana: "sábado", ordens: [] },
        { dia: "06-10-2024", semana: "domingo", ordens: [] },
        { dia: "07-10-2024", semana: "segunda-feira", ordens: [] },
        { dia: "08-10-2024", semana: "terça-feira", ordens: [] },
        { dia: "09-10-2024", semana: "quarta-feira", ordens: [] },
        { dia: "10-10-2024", semana: "quinta-feira", ordens: [] },
        { dia: "11-10-2024", semana: "sexta-feira", ordens: [] },
        { dia: "12-10-2024", semana: "sábado", ordens: [] },
        { dia: "13-10-2024", semana: "domingo", ordens: [] },
        { dia: "14-10-2024", semana: "segunda-feira", ordens: [] },
        { dia: "15-10-2024", semana: "terça-feira", ordens: [] },
        { dia: "16-10-2024", semana: "quarta-feira", ordens: [] },
        { dia: "17-10-2024", semana: "quinta-feira", ordens: [] },
        { dia: "18-10-2024", semana: "sexta-feira", ordens: [] },
        { dia: "19-10-2024", semana: "sábado", ordens: [] },
        { dia: "20-10-2024", semana: "domingo", ordens: [] },
        { dia: "21-10-2024", semana: "segunda-feira", ordens: [] },
        { dia: "22-10-2024", semana: "terça-feira", ordens: [] },
        { dia: "23-10-2024", semana: "quarta-feira", ordens: [] },
        { dia: "24-10-2024", semana: "quinta-feira", ordens: [] },
        { dia: "25-10-2024", semana: "sexta-feira", ordens: [] },
        { dia: "26-10-2024", semana: "sábado", ordens: [] },
        { dia: "27-10-2024", semana: "domingo", ordens: [] },
        { dia: "28-10-2024", semana: "segunda-feira", ordens: [] },
        { dia: "29-10-2024", semana: "terça-feira", ordens: [] },
        { dia: "30-10-2024", semana: "quarta-feira", ordens: [] },
        { dia: "31-10-2024", semana: "quinta-feira", ordens: [] },
        { dia: "01-11-2024", semana: "sexta-feira", ordens: [] },
        { dia: "02-11-2024", semana: "sábado", ordens: [] },
        { dia: "03-11-2024", semana: "domingo", ordens: [] },
        { dia: "04-11-2024", semana: "segunda-feira", ordens: [] },
        { dia: "05-11-2024", semana: "terça-feira", ordens: [] },
        { dia: "06-11-2024", semana: "quarta-feira", ordens: [] },
        { dia: "07-11-2024", semana: "quinta-feira", ordens: [] },
        { dia: "08-11-2024", semana: "sexta-feira", ordens: [] },
        { dia: "09-11-2024", semana: "sábado", ordens: [] },
        { dia: "10-11-2024", semana: "domingo", ordens: [] },
        { dia: "11-11-2024", semana: "segunda-feira", ordens: [] },
        { dia: "12-11-2024", semana: "terça-feira", ordens: [] },
        { dia: "13-11-2024", semana: "quarta-feira", ordens: [] },
        { dia: "14-11-2024", semana: "quinta-feira", ordens: [] },
        { dia: "15-11-2024", semana: "sexta-feira", ordens: [] },
        { dia: "16-11-2024", semana: "sábado", ordens: [] },
        { dia: "17-11-2024", semana: "domingo", ordens: [] },
        { dia: "18-11-2024", semana: "segunda-feira", ordens: [] },
        { dia: "19-11-2024", semana: "terça-feira", ordens: [] },
        { dia: "20-11-2024", semana: "quarta-feira", ordens: [] },
        { dia: "21-11-2024", semana: "quinta-feira", ordens: [] },
        { dia: "22-11-2024", semana: "sexta-feira", ordens: [] },
        { dia: "23-11-2024", semana: "sábado", ordens: [] },
        { dia: "24-11-2024", semana: "domingo", ordens: [] },
        { dia: "25-11-2024", semana: "segunda-feira", ordens: [] },
        { dia: "26-11-2024", semana: "terça-feira", ordens: [] },
        { dia: "27-11-2024", semana: "quarta-feira", ordens: [] },
        { dia: "28-11-2024", semana: "quinta-feira", ordens: [] },
        { dia: "29-11-2024", semana: "sexta-feira", ordens: [] },
        { dia: "30-11-2024", semana: "sábado", ordens: [] },
        { dia: "01-12-2024", semana: "domingo", ordens: [] },
        { dia: "02-12-2024", semana: "segunda-feira", ordens: [] },
        { dia: "03-12-2024", semana: "terça-feira", ordens: [] },
        { dia: "04-12-2024", semana: "quarta-feira", ordens: [] },
        { dia: "05-12-2024", semana: "quinta-feira", ordens: [] },
        { dia: "06-12-2024", semana: "sexta-feira", ordens: [] },
        { dia: "07-12-2024", semana: "sábado", ordens: [] },
        { dia: "08-12-2024", semana: "domingo", ordens: [] },
        { dia: "09-12-2024", semana: "segunda-feira", ordens: [] },
        { dia: "10-12-2024", semana: "terça-feira", ordens: [] },
        { dia: "11-12-2024", semana: "quarta-feira", ordens: [] },
        { dia: "12-12-2024", semana: "quinta-feira", ordens: [] },
        { dia: "13-12-2024", semana: "sexta-feira", ordens: [] },
        { dia: "14-12-2024", semana: "sábado", ordens: [] },
        { dia: "15-12-2024", semana: "domingo", ordens: [] },
        { dia: "16-12-2024", semana: "segunda-feira", ordens: [] },
        { dia: "17-12-2024", semana: "terça-feira", ordens: [] },
        { dia: "18-12-2024", semana: "quarta-feira", ordens: [] },
        { dia: "19-12-2024", semana: "quinta-feira", ordens: [] },
        { dia: "20-12-2024", semana: "sexta-feira", ordens: [] },
        { dia: "21-12-2024", semana: "sábado", ordens: [] },
        { dia: "22-12-2024", semana: "domingo", ordens: [] },
        { dia: "23-12-2024", semana: "segunda-feira", ordens: [] },
        { dia: "24-12-2024", semana: "terça-feira", ordens: [] },
        { dia: "25-12-2024", semana: "quarta-feira", ordens: [] },
        { dia: "26-12-2024", semana: "quinta-feira", ordens: [] },
        { dia: "27-12-2024", semana: "sexta-feira", ordens: [] },
        { dia: "28-12-2024", semana: "sábado", ordens: [] },
        { dia: "29-12-2024", semana: "domingo", ordens: [] },
        { dia: "30-12-2024", semana: "segunda-feira", ordens: [] },
        { dia: "31-12-2024", semana: "terça-feira", ordens: [] },
        { dia: "01-01-2025", semana: "quarta-feira", ordens: [] },
        { dia: "02-01-2025", semana: "quinta-feira", ordens: [] },
        { dia: "03-01-2025", semana: "sexta-feira", ordens: [] },
        { dia: "04-01-2025", semana: "sábado", ordens: [] },
        { dia: "05-01-2025", semana: "domingo", ordens: [] },
        { dia: "06-01-2025", semana: "segunda-feira", ordens: [] },
        { dia: "07-01-2025", semana: "terça-feira", ordens: [] },
        { dia: "08-01-2025", semana: "quarta-feira", ordens: [] },
        { dia: "09-01-2025", semana: "quinta-feira", ordens: [] },
        { dia: "10-01-2025", semana: "sexta-feira", ordens: [] },
        { dia: "11-01-2025", semana: "sábado", ordens: [] },
        { dia: "12-01-2025", semana: "domingo", ordens: [] },
        { dia: "13-01-2025", semana: "segunda-feira", ordens: [] },
        { dia: "14-01-2025", semana: "terça-feira", ordens: [] },
        { dia: "15-01-2025", semana: "quarta-feira", ordens: [] },
        { dia: "16-01-2025", semana: "quinta-feira", ordens: [] },
        { dia: "17-01-2025", semana: "sexta-feira", ordens: [] },
        { dia: "18-01-2025", semana: "sábado", ordens: [] },
        { dia: "19-01-2025", semana: "domingo", ordens: [] },
        { dia: "20-01-2025", semana: "segunda-feira", ordens: [] },
        { dia: "21-01-2025", semana: "terça-feira", ordens: [] },
        { dia: "22-01-2025", semana: "quarta-feira", ordens: [] },
        { dia: "23-01-2025", semana: "quinta-feira", ordens: [] },
        { dia: "24-01-2025", semana: "sexta-feira", ordens: [] },
        { dia: "25-01-2025", semana: "sábado", ordens: [] },
        { dia: "26-01-2025", semana: "domingo", ordens: [] },
        { dia: "27-01-2025", semana: "segunda-feira", ordens: [] },
        { dia: "28-01-2025", semana: "terça-feira", ordens: [] },
        { dia: "29-01-2025", semana: "quarta-feira", ordens: [] },
        { dia: "30-01-2025", semana: "quinta-feira", ordens: [] },
        { dia: "31-01-2025", semana: "sexta-feira", ordens: [] },
        { dia: "01-02-2025", semana: "sábado", ordens: [] },
        { dia: "02-02-2025", semana: "domingo", ordens: [] },
        { dia: "03-02-2025", semana: "segunda-feira", ordens: [] },
        { dia: "04-02-2025", semana: "terça-feira", ordens: [] },
        { dia: "05-02-2025", semana: "quarta-feira", ordens: [] },
        { dia: "06-02-2025", semana: "quinta-feira", ordens: [] },
        { dia: "07-02-2025", semana: "sexta-feira", ordens: [] },
        { dia: "08-02-2025", semana: "sábado", ordens: [] },
        { dia: "09-02-2025", semana: "domingo", ordens: [] },
        { dia: "10-02-2025", semana: "segunda-feira", ordens: [] },
        { dia: "11-02-2025", semana: "terça-feira", ordens: [] },
        { dia: "12-02-2025", semana: "quarta-feira", ordens: [] },
        { dia: "13-02-2025", semana: "quinta-feira", ordens: [] },
        { dia: "14-02-2025", semana: "sexta-feira", ordens: [] },
        { dia: "15-02-2025", semana: "sábado", ordens: [] },
        { dia: "16-02-2025", semana: "domingo", ordens: [] },
        { dia: "17-02-2025", semana: "segunda-feira", ordens: [] },
        { dia: "18-02-2025", semana: "terça-feira", ordens: [] },
        { dia: "19-02-2025", semana: "quarta-feira", ordens: [] },
        { dia: "20-02-2025", semana: "quinta-feira", ordens: [] },
        { dia: "21-02-2025", semana: "sexta-feira", ordens: [] },
        { dia: "22-02-2025", semana: "sábado", ordens: [] },
        { dia: "23-02-2025", semana: "domingo", ordens: [] },
        { dia: "24-02-2025", semana: "segunda-feira", ordens: [] },
        { dia: "25-02-2025", semana: "terça-feira", ordens: [] },
        { dia: "26-02-2025", semana: "quarta-feira", ordens: [] },
        { dia: "27-02-2025", semana: "quinta-feira", ordens: [] },
        { dia: "28-02-2025", semana: "sexta-feira", ordens: [] },
        { dia: "01-03-2025", semana: "sábado", ordens: [] },
        { dia: "02-03-2025", semana: "domingo", ordens: [] },
        { dia: "03-03-2025", semana: "segunda-feira", ordens: [] },
        { dia: "04-03-2025", semana: "terça-feira", ordens: [] },
        { dia: "05-03-2025", semana: "quarta-feira", ordens: [] },
        { dia: "06-03-2025", semana: "quinta-feira", ordens: [] },
        { dia: "07-03-2025", semana: "sexta-feira", ordens: [] },
        { dia: "08-03-2025", semana: "sábado", ordens: [] },
        { dia: "09-03-2025", semana: "domingo", ordens: [] },
        { dia: "10-03-2025", semana: "segunda-feira", ordens: [] },
        { dia: "11-03-2025", semana: "terça-feira", ordens: [] },
        { dia: "12-03-2025", semana: "quarta-feira", ordens: [] },
        { dia: "13-03-2025", semana: "quinta-feira", ordens: [] },
        { dia: "14-03-2025", semana: "sexta-feira", ordens: [] },
        { dia: "15-03-2025", semana: "sábado", ordens: [] },
        { dia: "16-03-2025", semana: "domingo", ordens: [] },
        { dia: "17-03-2025", semana: "segunda-feira", ordens: [] },
        { dia: "18-03-2025", semana: "terça-feira", ordens: [] },
        { dia: "19-03-2025", semana: "quarta-feira", ordens: [] },
        { dia: "20-03-2025", semana: "quinta-feira", ordens: [] },
        { dia: "21-03-2025", semana: "sexta-feira", ordens: [] },
        { dia: "22-03-2025", semana: "sábado", ordens: [] },
        { dia: "23-03-2025", semana: "domingo", ordens: [] },
        { dia: "24-03-2025", semana: "segunda-feira", ordens: [] },
        { dia: "25-03-2025", semana: "terça-feira", ordens: [] },
        { dia: "26-03-2025", semana: "quarta-feira", ordens: [] },
        { dia: "27-03-2025", semana: "quinta-feira", ordens: [] },
        { dia: "28-03-2025", semana: "sexta-feira", ordens: [] },
        { dia: "29-03-2025", semana: "sábado", ordens: [] },
        { dia: "30-03-2025", semana: "domingo", ordens: [] },
        { dia: "31-03-2025", semana: "segunda-feira", ordens: [] },
        { dia: "01-04-2025", semana: "terça-feira", ordens: [] },
        { dia: "02-04-2025", semana: "quarta-feira", ordens: [] },
        { dia: "03-04-2025", semana: "quinta-feira", ordens: [] },
        { dia: "04-04-2025", semana: "sexta-feira", ordens: [] },
        { dia: "05-04-2025", semana: "sábado", ordens: [] },
        { dia: "06-04-2025", semana: "domingo", ordens: [] },
        { dia: "07-04-2025", semana: "segunda-feira", ordens: [] },
        { dia: "08-04-2025", semana: "terça-feira", ordens: [] },
        { dia: "09-04-2025", semana: "quarta-feira", ordens: [] },
        { dia: "10-04-2025", semana: "quinta-feira", ordens: [] },
        { dia: "11-04-2025", semana: "sexta-feira", ordens: [] },
        { dia: "12-04-2025", semana: "sábado", ordens: [] },
        { dia: "13-04-2025", semana: "domingo", ordens: [] },
        { dia: "14-04-2025", semana: "segunda-feira", ordens: [] },
        { dia: "15-04-2025", semana: "terça-feira", ordens: [] },
        { dia: "16-04-2025", semana: "quarta-feira", ordens: [] },
        { dia: "17-04-2025", semana: "quinta-feira", ordens: [] },
        { dia: "18-04-2025", semana: "sexta-feira", ordens: [] },
        { dia: "19-04-2025", semana: "sábado", ordens: [] },
        { dia: "20-04-2025", semana: "domingo", ordens: [] },
        { dia: "21-04-2025", semana: "segunda-feira", ordens: [] },
        { dia: "22-04-2025", semana: "terça-feira", ordens: [] },
        { dia: "23-04-2025", semana: "quarta-feira", ordens: [] },
        { dia: "24-04-2025", semana: "quinta-feira", ordens: [] },
        { dia: "25-04-2025", semana: "sexta-feira", ordens: [] },
        { dia: "26-04-2025", semana: "sábado", ordens: [] },
        { dia: "27-04-2025", semana: "domingo", ordens: [] },
        { dia: "28-04-2025", semana: "segunda-feira", ordens: [] },
        { dia: "29-04-2025", semana: "terça-feira", ordens: [] },
        { dia: "30-04-2025", semana: "quarta-feira", ordens: [] },
        { dia: "01-05-2025", semana: "quinta-feira", ordens: [] },
        { dia: "02-05-2025", semana: "sexta-feira", ordens: [] },
        { dia: "03-05-2025", semana: "sábado", ordens: [] },
        { dia: "04-05-2025", semana: "domingo", ordens: [] },
        { dia: "05-05-2025", semana: "segunda-feira", ordens: [] },
        { dia: "06-05-2025", semana: "terça-feira", ordens: [] },
        { dia: "07-05-2025", semana: "quarta-feira", ordens: [] },
        { dia: "08-05-2025", semana: "quinta-feira", ordens: [] },
        { dia: "09-05-2025", semana: "sexta-feira", ordens: [] },
        { dia: "10-05-2025", semana: "sábado", ordens: [] },
        { dia: "11-05-2025", semana: "domingo", ordens: [] },
        { dia: "12-05-2025", semana: "segunda-feira", ordens: [] },
        { dia: "13-05-2025", semana: "terça-feira", ordens: [] },
        { dia: "14-05-2025", semana: "quarta-feira", ordens: [] },
        { dia: "15-05-2025", semana: "quinta-feira", ordens: [] },
        { dia: "16-05-2025", semana: "sexta-feira", ordens: [] },
        { dia: "17-05-2025", semana: "sábado", ordens: [] },
        { dia: "18-05-2025", semana: "domingo", ordens: [] },
        { dia: "19-05-2025", semana: "segunda-feira", ordens: [] },
        { dia: "20-05-2025", semana: "terça-feira", ordens: [] },
        { dia: "21-05-2025", semana: "quarta-feira", ordens: [] },
        { dia: "22-05-2025", semana: "quinta-feira", ordens: [] },
        { dia: "23-05-2025", semana: "sexta-feira", ordens: [] },
        { dia: "24-05-2025", semana: "sábado", ordens: [] },
        { dia: "25-05-2025", semana: "domingo", ordens: [] },
        { dia: "26-05-2025", semana: "segunda-feira", ordens: [] },
        { dia: "27-05-2025", semana: "terça-feira", ordens: [] },
        { dia: "28-05-2025", semana: "quarta-feira", ordens: [] },
        { dia: "29-05-2025", semana: "quinta-feira", ordens: [] },
        { dia: "30-05-2025", semana: "sexta-feira", ordens: [] },
        { dia: "31-05-2025", semana: "sábado", ordens: [] },
        { dia: "01-06-2025", semana: "domingo", ordens: [] },
        { dia: "02-06-2025", semana: "segunda-feira", ordens: [] },
        { dia: "03-06-2025", semana: "terça-feira", ordens: [] },
        { dia: "04-06-2025", semana: "quarta-feira", ordens: [] },
        { dia: "05-06-2025", semana: "quinta-feira", ordens: [] },
        { dia: "06-06-2025", semana: "sexta-feira", ordens: [] },
        { dia: "07-06-2025", semana: "sábado", ordens: [] },
        { dia: "08-06-2025", semana: "domingo", ordens: [] },
        { dia: "09-06-2025", semana: "segunda-feira", ordens: [] },
        { dia: "10-06-2025", semana: "terça-feira", ordens: [] },
        { dia: "11-06-2025", semana: "quarta-feira", ordens: [] },
        { dia: "12-06-2025", semana: "quinta-feira", ordens: [] },
        { dia: "13-06-2025", semana: "sexta-feira", ordens: [] },
        { dia: "14-06-2025", semana: "sábado", ordens: [] },
        { dia: "15-06-2025", semana: "domingo", ordens: [] },
        { dia: "16-06-2025", semana: "segunda-feira", ordens: [] },
        { dia: "17-06-2025", semana: "terça-feira", ordens: [] },
        { dia: "18-06-2025", semana: "quarta-feira", ordens: [] },
        { dia: "19-06-2025", semana: "quinta-feira", ordens: [] },
        { dia: "20-06-2025", semana: "sexta-feira", ordens: [] },
        { dia: "21-06-2025", semana: "sábado", ordens: [] },
        { dia: "22-06-2025", semana: "domingo", ordens: [] },
        { dia: "23-06-2025", semana: "segunda-feira", ordens: [] },
        { dia: "24-06-2025", semana: "terça-feira", ordens: [] },
        { dia: "25-06-2025", semana: "quarta-feira", ordens: [] },
        { dia: "26-06-2025", semana: "quinta-feira", ordens: [] },
        { dia: "27-06-2025", semana: "sexta-feira", ordens: [] },
        { dia: "28-06-2025", semana: "sábado", ordens: [] },
        { dia: "29-06-2025", semana: "domingo", ordens: [] },
        { dia: "30-06-2025", semana: "segunda-feira", ordens: [] },
        { dia: "01-07-2025", semana: "terça-feira", ordens: [] },
        { dia: "02-07-2025", semana: "quarta-feira", ordens: [] },
        { dia: "03-07-2025", semana: "quinta-feira", ordens: [] },
        { dia: "04-07-2025", semana: "sexta-feira", ordens: [] },
        { dia: "05-07-2025", semana: "sábado", ordens: [] },
        { dia: "06-07-2025", semana: "domingo", ordens: [] },
        { dia: "07-07-2025", semana: "segunda-feira", ordens: [] },
        { dia: "08-07-2025", semana: "terça-feira", ordens: [] },
        { dia: "09-07-2025", semana: "quarta-feira", ordens: [] },
        { dia: "10-07-2025", semana: "quinta-feira", ordens: [] },
        { dia: "11-07-2025", semana: "sexta-feira", ordens: [] },
        { dia: "12-07-2025", semana: "sábado", ordens: [] },
        { dia: "13-07-2025", semana: "domingo", ordens: [] },
        { dia: "14-07-2025", semana: "segunda-feira", ordens: [] },
        { dia: "15-07-2025", semana: "terça-feira", ordens: [] },
        { dia: "16-07-2025", semana: "quarta-feira", ordens: [] },
        { dia: "17-07-2025", semana: "quinta-feira", ordens: [] },
        { dia: "18-07-2025", semana: "sexta-feira", ordens: [] },
        { dia: "19-07-2025", semana: "sábado", ordens: [] },
        { dia: "20-07-2025", semana: "domingo", ordens: [] },
        { dia: "21-07-2025", semana: "segunda-feira", ordens: [] },
        { dia: "22-07-2025", semana: "terça-feira", ordens: [] },
        { dia: "23-07-2025", semana: "quarta-feira", ordens: [] },
        { dia: "24-07-2025", semana: "quinta-feira", ordens: [] },
        { dia: "25-07-2025", semana: "sexta-feira", ordens: [] },
        { dia: "26-07-2025", semana: "sábado", ordens: [] },
        { dia: "27-07-2025", semana: "domingo", ordens: [] },
        { dia: "28-07-2025", semana: "segunda-feira", ordens: [] },
        { dia: "29-07-2025", semana: "terça-feira", ordens: [] },
        { dia: "30-07-2025", semana: "quarta-feira", ordens: [] },
        { dia: "31-07-2025", semana: "quinta-feira", ordens: [] },
        { dia: "01-08-2025", semana: "sexta-feira", ordens: [] },
        { dia: "02-08-2025", semana: "sábado", ordens: [] },
        { dia: "03-08-2025", semana: "domingo", ordens: [] },
        { dia: "04-08-2025", semana: "segunda-feira", ordens: [] },
        { dia: "05-08-2025", semana: "terça-feira", ordens: [] },
        { dia: "06-08-2025", semana: "quarta-feira", ordens: [] },
        { dia: "07-08-2025", semana: "quinta-feira", ordens: [] },
        { dia: "08-08-2025", semana: "sexta-feira", ordens: [] },
        { dia: "09-08-2025", semana: "sábado", ordens: [] },
        { dia: "10-08-2025", semana: "domingo", ordens: [] },
        { dia: "11-08-2025", semana: "segunda-feira", ordens: [] },
        { dia: "12-08-2025", semana: "terça-feira", ordens: [] },
        { dia: "13-08-2025", semana: "quarta-feira", ordens: [] },
        { dia: "14-08-2025", semana: "quinta-feira", ordens: [] },
        { dia: "15-08-2025", semana: "sexta-feira", ordens: [] },
        { dia: "16-08-2025", semana: "sábado", ordens: [] },
        { dia: "17-08-2025", semana: "domingo", ordens: [] },
        { dia: "18-08-2025", semana: "segunda-feira", ordens: [] },
        { dia: "19-08-2025", semana: "terça-feira", ordens: [] },
        { dia: "20-08-2025", semana: "quarta-feira", ordens: [] },
        { dia: "21-08-2025", semana: "quinta-feira", ordens: [] },
        { dia: "22-08-2025", semana: "sexta-feira", ordens: [] },
        { dia: "23-08-2025", semana: "sábado", ordens: [] },
        { dia: "24-08-2025", semana: "domingo", ordens: [] },
        { dia: "25-08-2025", semana: "segunda-feira", ordens: [] },
        { dia: "26-08-2025", semana: "terça-feira", ordens: [] },
        { dia: "27-08-2025", semana: "quarta-feira", ordens: [] },
        { dia: "28-08-2025", semana: "quinta-feira", ordens: [] },
        { dia: "29-08-2025", semana: "sexta-feira", ordens: [] },
        { dia: "30-08-2025", semana: "sábado", ordens: [] },
        { dia: "31-08-2025", semana: "domingo", ordens: [] },
        { dia: "01-09-2025", semana: "segunda-feira", ordens: [] },
        { dia: "02-09-2025", semana: "terça-feira", ordens: [] },
        { dia: "03-09-2025", semana: "quarta-feira", ordens: [] },
        { dia: "04-09-2025", semana: "quinta-feira", ordens: [] },
        { dia: "05-09-2025", semana: "sexta-feira", ordens: [] },
        { dia: "06-09-2025", semana: "sábado", ordens: [] },
        { dia: "07-09-2025", semana: "domingo", ordens: [] },
        { dia: "08-09-2025", semana: "segunda-feira", ordens: [] },
        { dia: "09-09-2025", semana: "terça-feira", ordens: [] },
        { dia: "10-09-2025", semana: "quarta-feira", ordens: [] },
        { dia: "11-09-2025", semana: "quinta-feira", ordens: [] },
        { dia: "12-09-2025", semana: "sexta-feira", ordens: [] },
        { dia: "13-09-2025", semana: "sábado", ordens: [] },
        { dia: "14-09-2025", semana: "domingo", ordens: [] },
        { dia: "15-09-2025", semana: "segunda-feira", ordens: [] },
        { dia: "16-09-2025", semana: "terça-feira", ordens: [] },
        { dia: "17-09-2025", semana: "quarta-feira", ordens: [] },
        { dia: "18-09-2025", semana: "quinta-feira", ordens: [] },
        { dia: "19-09-2025", semana: "sexta-feira", ordens: [] },
        { dia: "20-09-2025", semana: "sábado", ordens: [] },
        { dia: "21-09-2025", semana: "domingo", ordens: [] },
        { dia: "22-09-2025", semana: "segunda-feira", ordens: [] },
        { dia: "23-09-2025", semana: "terça-feira", ordens: [] },
        { dia: "24-09-2025", semana: "quarta-feira", ordens: [] },
        { dia: "25-09-2025", semana: "quinta-feira", ordens: [] },
        { dia: "26-09-2025", semana: "sexta-feira", ordens: [] },
        { dia: "27-09-2025", semana: "sábado", ordens: [] },
        { dia: "28-09-2025", semana: "domingo", ordens: [] },
        { dia: "29-09-2025", semana: "segunda-feira", ordens: [] },
        { dia: "30-09-2025", semana: "terça-feira", ordens: [] },
        { dia: "01-10-2025", semana: "quarta-feira", ordens: [] },
        { dia: "02-10-2025", semana: "quinta-feira", ordens: [] },
        { dia: "03-10-2025", semana: "sexta-feira", ordens: [] },
        { dia: "04-10-2025", semana: "sábado", ordens: [] },
        { dia: "05-10-2025", semana: "domingo", ordens: [] },
        { dia: "06-10-2025", semana: "segunda-feira", ordens: [] },
        { dia: "07-10-2025", semana: "terça-feira", ordens: [] },
        { dia: "08-10-2025", semana: "quarta-feira", ordens: [] },
        { dia: "09-10-2025", semana: "quinta-feira", ordens: [] },
        { dia: "10-10-2025", semana: "sexta-feira", ordens: [] },
        { dia: "11-10-2025", semana: "sábado", ordens: [] },
        { dia: "12-10-2025", semana: "domingo", ordens: [] },
        { dia: "13-10-2025", semana: "segunda-feira", ordens: [] },
        { dia: "14-10-2025", semana: "terça-feira", ordens: [] },
        { dia: "15-10-2025", semana: "quarta-feira", ordens: [] },
        { dia: "16-10-2025", semana: "quinta-feira", ordens: [] },
        { dia: "17-10-2025", semana: "sexta-feira", ordens: [] },
        { dia: "18-10-2025", semana: "sábado", ordens: [] },
        { dia: "19-10-2025", semana: "domingo", ordens: [] },
        { dia: "20-10-2025", semana: "segunda-feira", ordens: [] },
        { dia: "21-10-2025", semana: "terça-feira", ordens: [] },
        { dia: "22-10-2025", semana: "quarta-feira", ordens: [] },
        { dia: "23-10-2025", semana: "quinta-feira", ordens: [] },
        { dia: "24-10-2025", semana: "sexta-feira", ordens: [] },
        { dia: "25-10-2025", semana: "sábado", ordens: [] },
        { dia: "26-10-2025", semana: "domingo", ordens: [] },
        { dia: "27-10-2025", semana: "segunda-feira", ordens: [] },
        { dia: "28-10-2025", semana: "terça-feira", ordens: [] },
        { dia: "29-10-2025", semana: "quarta-feira", ordens: [] },
        { dia: "30-10-2025", semana: "quinta-feira", ordens: [] },
        { dia: "31-10-2025", semana: "sexta-feira", ordens: [] },
        { dia: "01-11-2025", semana: "sábado", ordens: [] },
        { dia: "02-11-2025", semana: "domingo", ordens: [] },
        { dia: "03-11-2025", semana: "segunda-feira", ordens: [] },
        { dia: "04-11-2025", semana: "terça-feira", ordens: [] },
        { dia: "05-11-2025", semana: "quarta-feira", ordens: [] },
        { dia: "06-11-2025", semana: "quinta-feira", ordens: [] },
        { dia: "07-11-2025", semana: "sexta-feira", ordens: [] },
        { dia: "08-11-2025", semana: "sábado", ordens: [] },
        { dia: "09-11-2025", semana: "domingo", ordens: [] },
        { dia: "10-11-2025", semana: "segunda-feira", ordens: [] },
        { dia: "11-11-2025", semana: "terça-feira", ordens: [] },
        { dia: "12-11-2025", semana: "quarta-feira", ordens: [] },
        { dia: "13-11-2025", semana: "quinta-feira", ordens: [] },
        { dia: "14-11-2025", semana: "sexta-feira", ordens: [] },
        { dia: "15-11-2025", semana: "sábado", ordens: [] },
        { dia: "16-11-2025", semana: "domingo", ordens: [] },
        { dia: "17-11-2025", semana: "segunda-feira", ordens: [] },
        { dia: "18-11-2025", semana: "terça-feira", ordens: [] },
        { dia: "19-11-2025", semana: "quarta-feira", ordens: [] },
        { dia: "20-11-2025", semana: "quinta-feira", ordens: [] },
        { dia: "21-11-2025", semana: "sexta-feira", ordens: [] },
        { dia: "22-11-2025", semana: "sábado", ordens: [] },
        { dia: "23-11-2025", semana: "domingo", ordens: [] },
        { dia: "24-11-2025", semana: "segunda-feira", ordens: [] },
        { dia: "25-11-2025", semana: "terça-feira", ordens: [] },
        { dia: "26-11-2025", semana: "quarta-feira", ordens: [] },
        { dia: "27-11-2025", semana: "quinta-feira", ordens: [] },
        { dia: "28-11-2025", semana: "sexta-feira", ordens: [] },
        { dia: "29-11-2025", semana: "sábado", ordens: [] },
        { dia: "30-11-2025", semana: "domingo", ordens: [] },
        { dia: "01-12-2025", semana: "segunda-feira", ordens: [] },
        { dia: "02-12-2025", semana: "terça-feira", ordens: [] },
        { dia: "03-12-2025", semana: "quarta-feira", ordens: [] },
        { dia: "04-12-2025", semana: "quinta-feira", ordens: [] },
        { dia: "05-12-2025", semana: "sexta-feira", ordens: [] },
        { dia: "06-12-2025", semana: "sábado", ordens: [] },
        { dia: "07-12-2025", semana: "domingo", ordens: [] },
        { dia: "08-12-2025", semana: "segunda-feira", ordens: [] },
        { dia: "09-12-2025", semana: "terça-feira", ordens: [] },
        { dia: "10-12-2025", semana: "quarta-feira", ordens: [] },
        { dia: "11-12-2025", semana: "quinta-feira", ordens: [] },
        { dia: "12-12-2025", semana: "sexta-feira", ordens: [] },
        { dia: "13-12-2025", semana: "sábado", ordens: [] },
        { dia: "14-12-2025", semana: "domingo", ordens: [] },
        { dia: "15-12-2025", semana: "segunda-feira", ordens: [] },
        { dia: "16-12-2025", semana: "terça-feira", ordens: [] },
        { dia: "17-12-2025", semana: "quarta-feira", ordens: [] },
        { dia: "18-12-2025", semana: "quinta-feira", ordens: [] },
        { dia: "19-12-2025", semana: "sexta-feira", ordens: [] },
        { dia: "20-12-2025", semana: "sábado", ordens: [] },
        { dia: "21-12-2025", semana: "domingo", ordens: [] },
        { dia: "22-12-2025", semana: "segunda-feira", ordens: [] },
        { dia: "23-12-2025", semana: "terça-feira", ordens: [] },
        { dia: "24-12-2025", semana: "quarta-feira", ordens: [] },
        { dia: "25-12-2025", semana: "quinta-feira", ordens: [] },
        { dia: "26-12-2025", semana: "sexta-feira", ordens: [] },
        { dia: "27-12-2025", semana: "sábado", ordens: [] },
        { dia: "28-12-2025", semana: "domingo", ordens: [] },
        { dia: "29-12-2025", semana: "segunda-feira", ordens: [] },
        { dia: "30-12-2025", semana: "terça-feira", ordens: [] },
        { dia: "31-12-2025", semana: "quarta-feira", ordens: [] },
    ]

    for (let i of days) {
        const docRef = await setDoc(doc(db, "ordens", i.dia), {
            semana: i.semana,
            ordens: i.ordens
        })
    }

}

const populateAcessos = async () => {
    // const acessos: any[] = [
    //     { acessos: [{ link: `http://www.xgeo.com.br/Tracker/Default.aspx?emp=149100`, login: `COMLURB`, monitoramento: `MERCOSAT`, senha: `Comlurb` }], nome: `1  A KJP LOGISTICA LTDA`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `http://www.rjsat.com.br/index.php`, login: `OPENRTRANSPORTE`, monitoramento: `RJSAT`, senha: `openrtransporte` }], nome: `2MC TRANSPORTES RODOVIARIOS LTDA ME    `, obs: `acessar pelo rastreador veicular 01`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://www.positronrt.com.br/rastreador4/login.xhtml`, login: `ricardolo.machado@rio.rj.gov.br`, monitoramento: `Pósitron!`, senha: `fwnh` }], nome: `ACTION SHOP SERVICOS AMBIENTAIS LTDA`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `www.sascar.com.br / http://www.rjsat.com.br/index.php`, login: `arino421@operacao`, monitoramento: `SASCAR`, senha: `Restoeco2021` }], nome: `AATBF COLETA DE RESIDUOS PERIGOSOS EIRELI  `, obs: `Entra pela opção sascar web`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://www.trackerlog.com.br/apps/tracker/login.seam`, login: `GRUPOSTERICYCLE`, monitoramento: `TRACKER`, senha: `2021` }], nome: `ABORGAMA DO BRASIL LTDA   (bruno.fernandes@stericycle.com)`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://nogartel.fleetmap.io/`, login: `FCZCOMLURB`, monitoramento: `NORGATEL`, senha: `Comlurb1746*` }], nome: `AGILIZA SERVICOS E GERENCIAMENTO DE RESIDUOS LTDA. EPP. E ATUAL 2005`, obs: `MOZILA`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `http://www.rjsat.com.br/index.php`, login: `openaverde`, monitoramento: `RJSAT`, senha: `openaverde` }], nome: `AMBIENTE VERDE RESIDUOS LTDA EPP`, obs: `RASTREAODR VEICULAR 1`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `http://trace.bigtracker.com.br/login`, login: `comlurbami3@gmail.com`, monitoramento: `TRACKER`, senha: `123456` }], nome: `AMI3 SOLUCOES AMBIENTAIS E TRANSPORTE DE RESIDUOS LTDA.   `, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://sistema.lopac.com.br/login#//http://http://satcomrastreadores.app.br/login.aspx`, login: `AMCR/amcr.contato@gmail.com`, monitoramento: `LOPAC/SATCOM`, senha: `AMCR2022/amcr2022` }], nome: `AMCR SOLUCOES AMBIENTAIS`, obs: `Amcr S: 123456  ESSE LOGIN E SENHA PERTECEM AO VEICULO ONL 5027`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `http://worldsatdobrasil.ddns.net:8081/posicionamento___tempo_real_list.php`, login: `CSNB`, monitoramento: ``, senha: `CSNB` }], nome: `CSN`, obs: `WORLD SAT`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `http://www.xgeo.com.br/Tracker/Default.aspx?emp=117498`, login: `COMERCIODEFERRO`, monitoramento: `WWW.SYSTEMTRAC.COM.BR`, senha: `COMERCIODEFERRO` }], nome: `COMERCIO DE FERRO N.S. DA PIEDADE LTDA  `, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `http://www.rjsat.com.br/index.php`, login: ` OPENCLFAB`, monitoramento: `RJSAT`, senha: ` OPENCLFAB` }], nome: `CLEAN QUIMICA LTDA`, obs: `RASTREADOR 1`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `http://www.bysat.com.br/bylog/`, login: `ricardolo.machado@rio.rj.gov.br`, monitoramento: `Bysat.`, senha: `M@clima2023` }], nome: `DELURB AMBIENTAL LTDA`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://sasweb.sascar.com.br/unificadoweb/site/login`, login: `sbpapeis`, monitoramento: `SASCAR`, senha: `SBAMBIENTAL2022#` }], nome: `DEPOSITO DE APARAS DE PAPEIS S.B. LTDA`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `WWW.logikos.com.br`, login: `COMLURB`, monitoramento: `LOGIKOS`, senha: `1234` }], nome: `DEPOSITO DE PAPEL SANTA CECILIA LTDA`, obs: `ENTAR PELO INTERNET EXPLORE  TEL:21 968584569(RICARDO)`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://www.quatenus-system.com.br/quatenus10/QGti/Default.aspx?Language=pt-BR`, login: `ricardomachado@esgojet`, monitoramento: `ITURAN`, senha: `super@2022` }], nome: ` ESGO JET`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://www.cobli.co/ / https://app.infleet.com.br`, login: `ricardolo.machado@rio.rj.gov.br`, monitoramento: `COBLI/SYSTEMTRAC`, senha: `Comlurb@2007 / 123456` }], nome: `EKO AMBIENTAL SERVICOS E EMPREENDIMENTOS LTDA ME`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://www.cobli.co/ / https://www.systemtrac.com.br/`, login: `ric.lopes@yahoo.com.br / COMLURBEKO`, monitoramento: `COBLI`, senha: `Comlurb@529658 /comlurbeko` }], nome: `EKO TRANSPORTES E RECOLHIMENTO DE RESIDUOS LTDA-ME E KIOTO AMBIENTAL`, obs: `VEICULOS EKO E KIOTO`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `http://controllsystem.com.br/`, login: `ricardo.machado@rio.rj.gov.br`, monitoramento: `CONTROLL SYSTEM`, senha: `123456` }], nome: `ECO AMBIENTAL COMERCIO E TRNSPORTE DE RESIDUOS  LTDA`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `http://www.bysat.com.br/bylog/`, login: `diego.teixeira@ecologika.com.br`, monitoramento: `BYSAT`, senha: `Eco54321@` }], nome: `ECOLOGIKA AMBIENTAL TRANSPORTE E LOCACAO LTDA`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `GPS7.COM.BR`, login: `atendimento@fgcengenharia.com.br`, monitoramento: `GPS7`, senha: `0289` }], nome: `FGC PAVIMENTACAO E CONSTRUCAO CIVIL LTDA`, obs: `ENTAR PELO CHOME`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `http://forcaambiental.inlog.com.br:8092/Rastreamento/Apresentacao/Account/Login/`, login: `COMLURB`, monitoramento: `INLOG`, senha: `Inlog2023` }], nome: `FORCA AMBIENTAL LTDA  `, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://app.softruck.com http://www.xgeo.com.br/Tracker/Default.aspx?emp=160517 https://sasweb.sascar.com.br/unificadoweb/site/login`, login: `lrc3106/ KPW6E23/ THRONES@ANDERSON`, monitoramento: `SOFTRUCK / SASCAR / STATION TRACK`, senha: `14815833000115 / KPW6E23 / A2345678` }], nome: `GIGA AMBIENTAL LTDA EPP`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `http://www.rjsat.com.br/index.php`, login: `opencomlurb`, monitoramento: `RJSAT`, senha: `opencomlurb` }], nome: `GRI KOLETA - GERENCIAMENTO DE RESIDUOS INDUSTRIAIS S.A.`, obs: `acessar opção RASTREADOR VEICULAR 01`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `http://trace.bigtracker.com.br/login/`, login: `ideal@gmail.com`, monitoramento: `TRACKER`, senha: `123456` }], nome: `IDEAL COLETA AMBIENTAL.`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://iweb.ituran.com.br/iweb2/`, login: `iemma@servicosambientais.com.br`, monitoramento: `ITURAN`, senha: `9it@5668` }], nome: `IEMMA GERENCIADORA DE RESÍDUOS LTDA`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `sistema.getrak.com/latlong4u`, login: `comlurb.insight`, monitoramento: `GETRAK`, senha: `123456` }], nome: `INSIGHT AMBIENTAL CONSULTORIA LTDA`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://www.rotaexata.com.br/entrar`, login: `comlurb@comlurb.com.br`, monitoramento: `ROTA EXATA`, senha: `C987654#` }], nome: `IRMAOS RIBEIRO COMERCIO DE RESIDUOS E TRANSPORTE LTDA`, obs: `Cesar Brito -> tel: 9-7128-2901`, tipo: `Extraordinário` },
    //     { acessos: [{ link: ` www.systemtrac.com.br`, login: `JRF / JRFCOMLURB /jrf.coordenacao@gmail.com`, monitoramento: `SYSTEMTRAC`, senha: `JRF0101 /  JRFCOMLURB /123456` }], nome: `JRF MANUTENCAO E SERVICOS EIRELI ME`, obs: `VEICULO LSE1G91 L:JRFMANUTENCAO S: jm2018 https://www.globalsafe.com.br/portal/https://family.systemsatx.com.br/`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://satcomrastreadores.com.br/rastrear-veiculo`, login: `landtecambiental@hotmail.com`, monitoramento: `SATCOM RASTREADORES`, senha: `4620` }], nome: `LANDTEC CONSULTORIA AMBIENTAL E SERVICOS DE CONSTRUCAO CIVIL LTDA`, obs: `MOZILLA`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://www.portalunitrac.com/unitrac/unitrac_login/unitrac_login.php`, login: `COMLURB`, monitoramento: `UNITRAC`, senha: `comlurb` }], nome: `METAK METAIS KENNEDY LTDA E METAK RIO GERENCIAMENTO`, obs: ` www2.portalunitrac.com    NAVEGADOR MOZILA`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `http://www.rjsat.com.br/index.php`, login: `Openmmv`, monitoramento: `RJSAT`, senha: `openmmv` }], nome: `MMV SOLUÇOES AMBIENTAIS`, obs: `ACESSAR OPCAO RASTREADOR VEICULAR 01`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://track.eagletrack.com.br/`, login: `nativitta_comlurb@nativitta.com.br`, monitoramento: `EAGLE TRACK`, senha: `nativitta2022` }], nome: `NATIVITTA PLANEJAMENTOS PROJETOS E GERENCIAMENTO EM SAUDE E AMBIENTE LT`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://sistema.rotaexata.com.br/auth/login`, login: `operacional.niteroi@resgateresiduos.com.br`, monitoramento: `ROTA EXATA`, senha: `123456` }], nome: `OPERACAO RESGATE TRANSPORTES LTDA EPP`, obs: `NAVEGADOR MOZILA`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://sis.getrak.com/agilrastreamento`, login: ` comlurb`, monitoramento: `GETRAK`, senha: `12345` }], nome: `PLURAL SERVIÇOS TECNICOS`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://vfleets.com.br/login`, login: `contato01@prorecicle.com.br`, monitoramento: `TRIMBLE`, senha: `faria4321` }], nome: `PRORECICLE AMBIENTAL TRANSPORTES E RECICLAVEIS LTDA ME  `, obs: `NAVEGADOR MOZILA`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `sistema.addlog.com.br/renovesolucoes/ `, login: `comlurb@renovesolucoes.com`, monitoramento: `ADDLOG`, senha: `654321` }], nome: `RENOVE SOLUCOES AMBIENTAIS LTDA`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://sistema.getrak.com/latlong4u / www.rjsat.com.br`, login: `marcio.resilog / RJSRESTRLO`, monitoramento: `GETRAK`, senha: `resilog2023 / RJSRESTRLO` }], nome: `RESILOG TRANSPORTE E LOGISTICA LTDA`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `www.wrrastreamento.com`, login: `COMLURB`, monitoramento: `WR RASTREAMENTO`, senha: `651563` }], nome: `RESIDUO ALL DE COPACABANA SERVICOS DE BIO SEGURANCA LTDA`, obs: `ACESSAR WR SEMPRE`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://wrrastreamento.com/rastreamento/`, login: `07033770000180 / nosneuro`, monitoramento: `WR RASTREAMENTO`, senha: `JLF123` }], nome: `RINOBRILHO  `, obs: `ACESSAR WR PLUS MAIS ( Login: nosneuro Senha: nosneuro http://www.fleetsystems.com.br/v2 -DADOS DO VEICULO LSN7A16`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `http://satcomrastreadores.app.br/`, login: `credenciadaslcz_comlurb@rio.rj.gov.br`, monitoramento: `SATCOM RASTREADORES`, senha: `comlurbrodocon` }], nome: `RODOCON CONSTRUCOES RODOVIARIAS LTDA`, obs: `Use o navegador Google Chrome 2 - Tenha plugin flash player instalado3 - Use uma internet com mínimo de 2Mb de velocidade`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `http://www.rjsat.com.br/index.php`, login: `002OPENSMTRANSPORTES`, monitoramento: `RJSAT`, senha: `002OPENSMTRANSPORTES` }], nome: `SM OLIVEIRA  SANTOS TRANSPORTE`, obs: `OPÇÃO RASTRADOR VEICULAR 01 DAJ8837 - SATCOM RASTREADORES LOGIN: cacambalegalrj@gmail.com Senha: @cristo731`, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://track.eagletrack.com.br/#/login / http://http://www.rjsat.com.br/index.php/ https://track.eagletrack.com.br/#/login`, login: `servioeste_comlurb@servioeste.com.br / AVGERENTESUPRA`, monitoramento: `EAGLE TRACK/RJSAT`, senha: `servioeste2022 / AVGERENTESUPRA / COMLURB2022` }], nome: `SERVIOESTE RIO DE JANEIRO LTDA  E SERVIOSTE SOLUCAO`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `http://www.satcomrastreadores.com.br/portalgr`, login: `comercial@symplicius.com.br`, monitoramento: `SATCOM RASTREADORES`, senha: `symp5742` }], nome: `SIMPLICIUS COLETA E REMOÇÃO DE RESÍDUOS EIRELE    `, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `http://www.xgeo.com.br/Tracker/Default.aspx?emp=145169`, login: `COMLURB`, monitoramento: `RAJATRCK`, senha: `solucao2018` }], nome: `SOLUCAO GERENCIAMENTO DE RESIDUOS LTDA EPP`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `www.systemtrac.com.br / WWW.RJSAT.COM.BR`, login: `SUSTENTA / RJSSUSPRA`, monitoramento: `SYSTEM TRAC / RJSAT`, senha: `SUSTENTA /RJSSUSPRA` }], nome: `SUSTENTA COMERCIO E SERVIÇOS LIMITADA`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `www.rjsat.com.br`, login: `RJSSUPRATRA`, monitoramento: `RJSAT`, senha: `RJSSUPRATRA` }], nome: `TRASBRAGANÇA COMERCIO`, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://www.linkmonitoramento.com.br/`, login: `mribeiro@ultrasol.com.br`, monitoramento: `LINK MONITORAMENTO`, senha: `mr201288` }], nome: `ULTRASOL AMBIENTAL LTDA  `, obs: ``, tipo: `Extraordinário` },
    //     { acessos: [{ link: `https://frotas.eyeon.com.br/Account/LogOn?ReturnUrl=%2fTempoReal`, login: `venativ_gps`, monitoramento: `TECMIC`, senha: ` comlurb` }], nome: `VIDEVERDE COMPOSTAGEM LTDA EPP`, obs: ``, tipo: `Extraordinário` },
    // ]

    const acessos: any[] = [
        {
            acessos: [
                {
                    link: "http://www.rjsat.com.br/index.php",
                    login: "openaverde",
                    monitoramento: "RJSAT",
                    senha: "openaverde"
                }
            ],
            nome: "AMBIENTE VERDE RESIDUOS LTDA EPP",
            obs: "RASTREAODR VEICULAR 1",
            tipo: "Reciclagem"
        },

        {
            acessos: [{
                link: "WWW.logikos.com.br",
                login: "COMLURB",
                monitoramento: "LOGIKOS",
                senha: "1234"
            }],

            nome: "DEPOSITO DE PAPEL SANTA CECILIA LTDA",

            obs: "ENTAR PELO INTERNET EXPLORE TEL:21 968584569(RICARDO)",
            tipo: "Reciclagem"
        },
        {
            acessos: [
                {
                    link: "https://www.cobli.co",
                    login: "ric.lopes@yahoo.com.br",
                    monitoramento: "COBLI",
                    senha: "Comlurb@529658"
                },
                {
                    link: "https://www.systemtrac.com.br",
                    login: "COMLURBEKO",
                    monitoramento: "COBLI",
                    senha: "comlurbeko"
                }
            ],
            nome: "EKO TRANSPORTES E RECOLHIMENTO DE RESIDUOS LTDA-ME E KIOTO AMBIENTAL",
            obs: "VEICULOS EKO E KIOTO",
            tipo: "Reciclagem"
        },
        {
            acessos: [
                {
                    link: "http://www.rjsat.com.br/index.php",
                    login: "opencomlurb",
                    monitoramento: "RJSAT",
                    senha: "opencomlurb"
                }
            ],
            nome: "GRI KOLETA - GERENCIAMENTO DE RESIDUOS INDUSTRIAIS S.A.",
            obs: "acessar opção RASTREADOR VEICULAR 01",
            tipo: "Reciclagem"
        },
        {
            acessos: [{
                link: "sistema.getrak.com/latlong4u",
                login: "comlurb.insight",
                monitoramento: "GETRAK",
                senha: "123456"
            }],
            nome: "INSIGHT AMBIENTAL CONSULTORIA LTDA",
            obs: "",
            tipo: "Reciclagem"
        },
        {
            acessos: [{
                link: "https://vfleets.com.br/login",
                login: "contato01@prorecicle.com.br",
                monitoramento: "TRIMBLE",
                senha: "faria4321"
            }],
            nome: "PRORECICLE AMBIENTAL TRANSPORTES E RECICLAVEIS LTDA ME ",
            obs: "NAVEGADOR MOZILA",
            tipo: "Reciclagem"
        },
        {
            acessos: [{
                link: "http://www.xgeo.com.br/Tracker/Default.aspx?emp=145169",
                login: "COMLURB",
                monitoramento: "RAJATRCK",
                senha: "solucao2018"
            }],
            nome: "SOLUCAO GERENCIAMENTO DE RESIDUOS LTDA EPP",
            obs: "",
            tipo: "Reciclagem"
        }

    ]

    const data = acessos.sort(function (a, b) {
        return a.nome.localeCompare(b.nome)
    })

    for (let d of data) {
        await InsertEmpresa(d)
    }
}

const populateBases = async () => {
    const bases: any[] = [{
        "unit": "Diversas",
        "type": "Grande Gerador",
    },
    {
        "unit": "Diversas",
        "type": "Lixo Zero"
    },
    {
        "unit": "Barra da Tijuca",
        "type": "Grande Gerador"
    },
    {
        "unit": "Barra da Tijuca",
        "type": "Lixo Zero"
    },
    {
        "unit": "Campo Grande",
        "type": "Lixo Zero"
    },
    {
        "unit": "Centro",
        "type": "Grande Gerador"
    },
    {
        "unit": "Centro",
        "type": "Lixo Zero"
    },
    {
        "unit": "Ilha do Governador",
        "type": "Grande Gerador"
    },
    {
        "unit": "Jacarépagua",
        "type": "Grande Gerador"
    },
    {
        "unit": "Meier",
        "type": "Lixo Zero"
    },
    {
        "unit": "Tijuca",
        "type": "Administrativo"
    },
    {
        "unit": "Tijuca",
        "type": "Grande Gerador"
    },
    {
        "unit": "Zona Norte",
        "type": "Grande Gerador"
    },
    {
        "unit": "Zona Oeste",
        "type": "Grande Gerador"
    },
    {
        "unit": "Zona Sul",
        "type": "Grande Gerador"
    },
    {
        "unit": "Zona Sul",
        "type": "Lixo Zero"
    },
    {
        "unit": "Madureira",
        "type": "Lixo Zero"
    },
    {
        "unit": "Tijuca",
        "type": "Lixo Zero"
    },
    {
        "unit": "Zona Norte",
        "type": "Lixo Zero"
    }
    ]

    const data = bases.sort(function (a, b) {
        return a.unit.localeCompare(b.unit)
    })

    console.log(data)

    const docRef = await setDoc(doc(db, "bases", "dados"), { data })

    console.log('ok')

}

const populatEmails = async () => {

    const emails: any[] = [
        {
            "Email": "andreh.soares@rio.rj.gov.br",
            "Name": "Andre Soares"
        },
        {
            "Email": "eddiemoreira1@gmail.com",
            "Name": "Antônio Carlos - Zona Norte"
        },
        {
            "Email": "andreh.soares@rio.rj.gov.br",
            "Name": "Andre Soares"
        },
        {
            "Email": "edirceuluizgomes@gmail.com",
            "Name": "Edirceu -  Barra"
        },
        {
            "Email": "eddiemoreira1@gmail.com",
            "Name": "Antônio Carlos - Zona Norte"
        },
        {
            "Email": "Edsonferreira080903@gmail.com",
            "Name": "Edson - Copacabana "
        },
        {
            "Email": "edirceuluizgomes@gmail.com",
            "Name": "Edirceu -  Barra"
        },
        {
            "Email": "furtado.comlurb@gmail.com",
            "Name": "Eduardo Furtado"
        },
        {
            "Email": "Edsonferreira080903@gmail.com",
            "Name": "Edson - Copacabana "
        },
        {
            "Email": "Eliaaguiar@yahoo.com.br",
            "Name": "Elias - Barra"
        },
        {
            "Email": "furtado.comlurb@gmail.com",
            "Name": "Eduardo Furtado"
        },
        {
            "Email": "fcz.naof@gmail.com",
            "Name": "FCZ NAO"
        },
        {
            "Email": "Eliaaguiar@yahoo.com.br",
            "Name": "Elias - Barra"
        },
        {
            "Email": "fcz.naof@gmail.com",
            "Name": "FCZ NAO"
        },
        {
            "Email": "pr.luisbarros@gmail.com",
            "Name": "Jorge - Tijuca"
        },
        {
            "Email": "josetaniom62@gmail.com",
            "Name": "José Tânio - Zona Sul"
        },
        {
            "Email": "pr.luisbarros@gmail.com",
            "Name": "Jorge - Tijuca"
        },
        {
            "Email": "josetaniom62@gmail.com",
            "Name": "José Tânio - Zona Sul"
        },
        {
            "Email": "nieraldo@gmail.com",
            "Name": "Nieraldo Lima"
        },
        {
            "Email": "paulobotafogo1962@gmail.com",
            "Name": "Paulo Antônio - Campo Grande"
        },
        {
            "Email": "nieraldo@gmail.com",
            "Name": "Nieraldo Lima"
        },
        {
            "Email": "paulo.luiz@rio.rj.gov.br",
            "Name": "Paulo Luiz"
        },
        {
            "Email": "paulobotafogo1962@gmail.com",
            "Name": "Paulo Antônio - Campo Grande"
        },
        {
            "Email": "paulo.luiz@rio.rj.gov.br",
            "Name": "Paulo Luiz"
        },
        {
            "Email": "jaqueliine.alexandre@gmail.com",
            "Name": "Jaqueline - Centro"
        },
        {
            "Email": "limamari13@gmail.com",
            "Name": "Maria - Madureira"
        }

    ]

    const modelo = emails.sort(function (a, b) {
        return a.Name.localeCompare(b.Name)
    })

    for (let data of modelo) {

        const config: AxiosRequestConfig = {
            url: "https://fcz-nao-default-rtdb.firebaseio.com/emailNovo.json",
            method: "post",
            data
        }

        await axios(config)

    }

}

//populatEmails()


/**
 * Povoa as opões da ordem de serviço por tipo e item
 * @param tipo 
 * @param item 
 * @returns 
 */
const PopDados = (tipo: any, item: any[]) => {

    return new Promise(async (resolve, reject) => {
        try {

            const obj: objectId = {}

            obj[tipo] = item
            obj['merge'] = true

            resolve(obj)
        } catch (err) {
            reject(err)
        }
    })
}

const DeleteOrdem = (data: any, ordens: IOrdem[], id: any) => {

    return new Promise(async (resolve, reject) => {
        try {

            const aux: any[] = []

            ordens.forEach((x: IOrdem) => {
                const obj: objectId = {}
                obj[x.key || ""] = x
                aux.push(obj)
            })

            const ordemRef = await setDoc(doc(db, "ordens", data), {
                ordens: aux
            }, { merge: true })

            resolve(ordemRef)
        } catch (err) {
            reject(err)
        }
    })
}


/**
 * Atualiza os itens dos dados do array de acessos
 * @param data ]
 */
const UpdateAcessos = (data: any) => {

    return new Promise(async (resolve, reject) => {
        try {


            const ordemRef = await setDoc(doc(db, "acessos", "dados"), {
                data
            }, { merge: true })

            resolve(ordemRef)
        } catch (err) {
            reject(err)
        }
    })
}


/**
 * Insere uma ordem de serviço no array ordens de um determinado dia
 * com um número de ordem específico.
 * @param data a data formato dd-mm-yyyy
 * @param ordem os dados da ordem de serviço interface IOrdem
 * @param id o número da ordem de serviço
 * @returns 
 */
const InsertOrdem = async (data: string, ordem: IOrdem, id: any) => {

    const ord: objectId = {}
    ord[id] = ordem

    return new Promise(async (resolve, reject) => {
        try {
            const ordemRef = doc(db, "ordens", data)

            await updateDoc(ordemRef, {
                ordens: arrayUnion(ord)
            })

            resolve(ordemRef)
        } catch (err) {
            reject(err)
        }
    })
}

/**
 * Retorna as opções da OS NAO
 * @returns 
 */
const GetOpcoes = async (): Promise<IOptions | DocumentData> => {

    return new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, "dados", "opcoes")
            const docSnap = await getDoc(docRef)
            const response = docSnap.data()

            const transform: IOptions = {
                acao: [],
                integracao: [],
                motivacao: [],
                recursos: [],
                segmento: [],
                unidades: []
            }

            response!.acao.forEach((x: any) => {
                transform['acao'].push({ label: x, value: x })
            })

            response!.integracao.forEach((x: any) => {
                transform['integracao'].push({ label: x, value: x })
            })

            response!.motivacao.forEach((x: any) => {
                transform['motivacao'].push({ label: x, value: x })
            })

            response!.recursos.forEach((x: any) => {
                transform['recursos'].push({ label: x, value: x })
            })

            response!.segmento.forEach((x: any) => {
                transform['segmento'].push({ label: x, value: x })
            })

            response!.unidades.forEach((x: any) => {
                transform['unidades'].push({ label: x, value: x })
            })

            resolve(transform)


        } catch (err) {
            reject(err)
        }
    })
}

/**
 * Retorna as opções das bases virtuais de serviço do LX e GG
 * @returns 
 */
const GetBases = async () => {

    return new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, "bases", "dados")
            const docSnap = await getDoc(docRef)
            const response = docSnap.data()


            resolve(response)


        } catch (err) {
            reject(err)
        }
    })
}

/**
 * Retorna as informações de acesso dos sistemas de monitoramento de frota
 * @returns 
 */
const GetAcessos = async () => {

    return new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, "acessos", "dados")
            const docSnap = await getDoc(docRef)
            const response: any = docSnap.data()

            resolve(response.data)

        } catch (err) {
            reject(err)
        }
    })
}


/**
 * Remove um item especifico em relação ao seu tipo
 * @param tipo index do tipo
 * @param item especificação do item
 * @returns 
 */
const RemoveItemOpcoes = (tipo: number, item: string) => {

    return new Promise(async (resolve, reject) => {
        try {

            const ordemRef = doc(db, "dados", 'opcoes')

            switch (tipo) {
                case 1:
                    await updateDoc(ordemRef, {
                        acao: arrayRemove(item)
                    })
                    break
                case 2:
                    await updateDoc(ordemRef, {
                        integracao: arrayRemove(item)
                    })
                    break
                case 3:
                    await updateDoc(ordemRef, {
                        motivacao: arrayRemove(item)
                    })
                    break
                case 4:
                    await updateDoc(ordemRef, {
                        recursos: arrayRemove(item)
                    })
                    break
                case 5:
                    await updateDoc(ordemRef, {
                        segmento: arrayRemove(item)
                    })
                    break
                default:
                    break
            }

            resolve(ordemRef)
        } catch (err) {
            reject(err)
        }
    })
}

/**
 * Insere um item especifico em relação ao seu tipo
 * @param tipo index do tipo
 * @param item especificação do item
 * @returns 
 */
const InsertItemOpcoes = (tipo: string, item: string) => {
    const ord: objectId = {}

    return new Promise(async (resolve, reject) => {
        try {
            const ordemRef = doc(db, "dados", 'opcoes')
            ord[tipo] = arrayUnion(item)
            const response = await updateDoc(ordemRef, ord)
            resolve(response)
        } catch (err) {
            reject(err)
        }
    })
}

/**
 * Permite aprovadar ou desaprovar uma OS para que siga para distribução
 * @param data Precisa estar no formato dd-mm-yyyy
 * @param aprovador
 * @param aprovado (boleano) seta a aprovação ou desaprovação das OS
 * @param obs
 * @returns 
 */
const InsertAproveOS = (data: string, aprovador: string, aprovado: boolean, obs: string) => {
    const ord: objectId = {}

    return new Promise(async (resolve, reject) => {
        try {
            const ordemRef = doc(db, "ordens", data)
            const aprove = { aprovado, aprovador, obs }
            const response = await updateDoc(ordemRef, aprove)
            resolve(response)
        } catch (err) {
            reject(err)
        }
    })
}

// InsertAproveOS("01-01-2024", "nieraldo@gmail.com", true, "alguma obs")
//     .then(() => console.log('feito'))



/**
 * 
 * @returns o número da ordem de serviço da vez
 */
const GetNumeroOrdem = async () => {

    return new Promise(async (resolve, reject) => {
        try {
            const querySnapshot = await getDocs(collection(db, "ordens"))
            const notEmpty: any = []

            const x = querySnapshot

            querySnapshot.forEach((doc) => {
                if (doc.data().ordens.length > 0) {
                    notEmpty.push(doc.data().ordens.length)
                }
            })

            let amount = 0

            notEmpty.forEach((x: number) => {
                amount += x
            })

            resolve(`${(amount + 1).toString().padStart(3, "0")}/${agora.year()}`)
        } catch (err) {
            reject(err)
        }
    })
}

/**
 * Retorna um dia de ordem de serviço
 * @param data 
 * @returns 
 */
const GetDayOrdem = async (data: string): Promise<IOrdem[]> => {

    return new Promise(async (resolve, reject) => {
        try {
            const ordensRef = doc(db, "ordens", data)
            const docSnap = await getDoc(ordensRef)
            const infos: any = docSnap.data()

            if (infos!['ordens'].length === 0) {
                resolve([])
            }

            const ordens = infos!['ordens']
            const dados: IOrdem[] = []
            ordens.forEach((x: any) => {
                const key = Object.keys(x)[0]
                const obj = x[key]
                dados.push({
                    key,
                    unit: obj['unit'],
                    recursos: obj['recursos'],
                    inicio: obj['inicio'],
                    fim: obj['fim'],
                    dataOrdem: obj['dataOrdem'],
                    segmento: obj['segmento'],
                    acao: obj['acao'],
                    motivacao: obj['motivacao'],
                    equipe: obj['equipe'],
                    integracao: obj['integracao'],
                    local: obj['local'],
                    status: obj['status'],
                    relatorio: obj['relatorio'] ? obj['relatorio'] : null,
                    relator: obj['relator'] ? obj['relator'] : null,
                    responsavel: obj['responsavel'] ? obj['responsavel'] : null,
                    dataEnvio: obj['dataEnvio'] ? obj['dataEnvio'] : null
                })


            })

            resolve(dados)
        } catch (err) {
            reject(err)
        }
    })
}

/**
 * Retorna uma ordem de serviço
 * @param data 
 * @returns 
 */
const GetOrdem = async (data: string): Promise<IOs> => {

    return new Promise(async (resolve, reject) => {
        try {
            const ordensRef = doc(db, "ordens", data)
            const docSnap = await getDoc(ordensRef)
            const infos: any = docSnap.data()
            resolve(infos)
        } catch (err) {
            reject(err)
        }
    })
}

// GetOrdem('01-01-2024')
//     .then(data => console.log(data))

/**
 * Retorna o usuário atual da aplicação, pelo uid
 * @param uid 
 * @returns 
 */
const GetUser = (uid: string) => {
    const config: AxiosRequestConfig = {
        method: 'get',
        url: `${URLNAO}/users.json?orderBy="uid"&equalTo="${uid}"`
    }

    return axios(config)
}

/**
 * Retorna todos os usuários independentemente do tipo
 * @returns 
 */
const GetAllUser = () => {
    const config: AxiosRequestConfig = {
        method: 'get',
        url: `${URLNAO}/users.json`
    }

    return axios(config)
}

/**
 * Salva um usuário nno bando de dados 'users'
 * @param iuser 
 * @param indice valor a ser usado como chave do objeto
 * @returns 
 */
const PatchUser = (iuser: User, indice: string,) => {

    const usuario: objectId = {}
    usuario[indice] = {
        email: iuser.email,
        rules: iuser.rules,
        uid: iuser.uid,
        nome: iuser.nome,
        matricula: iuser.matricula
    }

    const config: AxiosRequestConfig = {
        method: 'patch',
        url: `${URLNAO}/users.json`,
        data: usuario
    }

    return axios(config)
}

/**
 * Salva uma empresa como tipo caçamba e cria um documento do banco de dados 'users'
 * para estender os dados desse usuário além dos dados básicos de login e senha
 * @param id indice do objeto empresa(cacambas)
 * @param iempresa 
 * @param indice indice do objeto usuário(users)
 * @returns 
 */
const PatchEmpresaCacambas = (id: string, iempresa: IEmpresa, indice: string,) => {
    const objectId: objectId = {}
    const empresa: objectId = {}

    objectId[id] = iempresa
    empresa[indice] = {
        autorizada: iempresa.autorizada,
        email: iempresa.email,
        razaosocial: iempresa.razaosocial,
        type: "caçamba"
    }

    const configEmpresa: AxiosRequestConfig = {
        method: 'patch',
        url: `${URLNAO}/empresas.json`,
        data: empresa
    }

    axios(configEmpresa)

    const config: AxiosRequestConfig = {
        method: 'patch',
        url: `${URLNAO}/users.json`,
        data: objectId
    }

    return axios(config)
}

/**
 * 
 * @returns Retorna todas as empresas independentemente do tipo
 */
const GetAllEmpresas = async (): Promise<IEmpresa[]> => {

    const config: AxiosRequestConfig = {
        method: 'get',
        url: `${URLNAO}/empresas.json`
    }

    const response = await axios(config)
        .then(data => {

            const listObjectId = Object.keys(data.data)
            const empresas: IEmpresa[] = []
            listObjectId.forEach(obj => {
                const aux: IEmpresa = {
                    autorizada: data.data[obj].autorizada,
                    cnpj: data.data[obj].cnpj,
                    id: obj,
                    razaosocial: data.data[obj].razaosocial
                }

                empresas.push(aux)
            })

            return empresas

        })
        .catch(err => {
            return err
        })

    return response

}

/**
 * Retorna os dados de georeferência levando em consideração um endereço fornecido
 * @param param 
 * @returns 
 */
const Geocoder = async (param: string): Promise<Location> => {
    const street = encodeURI(param)
    const apiKey = import.meta.env.VITE_apiKey
    const URLLOCAL = `https://maps.googleapis.com/maps/api/geocode/json?address=${street}&key=${apiKey}`
    const config: AxiosRequestConfig = {
        method: 'get',
        url: URLLOCAL
    }

    const response = await axios(config)
    const { geometry } = response.data.results[0]
    const { location } = geometry

    const obj: Location = {
        lat: location.lat,
        lng: location.lng
    }

    return obj
}

/**
 * Retorna os dados de georeferência levando em consideração um endereço fornecido de forma assícrona
 * @param param 
 * @returns 
 */
const GeocoderAsync = async (param: string): Promise<Location> => {
    return new Promise(async (resolve, reject) => {
        try {
            const street = encodeURI(param)
            const apiKey = import.meta.env.VITE_apiKey
            const URLLOCAL = `https://maps.googleapis.com/maps/api/geocode/json?address=${street}&key=${apiKey}`
            const config: AxiosRequestConfig = {
                method: 'get',
                url: URLLOCAL
            }

            const response = await axios(config)
            const { geometry } = response.data.results[0]
            const { location } = geometry

            const obj: Location = {
                lat: location.lat,
                lng: location.lng
            }

            resolve(obj)
        } catch (err) {
            reject(err)
        }
    })
}

/**
 * Salva uma caçamba no banco de dados
 * @param uid id do usuário
 * @param icacambas 
 * @param indice indice do objeto caçamba
 * @returns 
 */
const PatchCacambas = (uid: string, icacambas: ICacambas, indice: string,) => {
    const cacamba: objectId = {}
    icacambas.id = indice
    icacambas.uid = uid
    cacamba[indice] = icacambas


    const configEmpresa: AxiosRequestConfig = {
        method: 'patch',
        url: `${URLNAO}/cacambas.json`,
        data: cacamba
    }

    return axios(configEmpresa)
}

/**
 * Retorna todos as caçambas colocadas pelo usuário atual da aplicação pelo uid
 * @param uid 
 * @returns 
 */
const GetAllCacambasPeloUID = async (uid: string): Promise<ICacambas[]> => {

    const config: AxiosRequestConfig = {
        method: 'get',
        url: `${URLNAO}/cacambas.json?orderBy="uid"&equalTo="${uid}"`
    }

    const response = await axios(config)
        .then(data => {

            const listObjectId = Object.keys(data.data)
            const cacambas: ICacambas[] = []
            listObjectId.forEach(obj => {
                const aux: ICacambas = {
                    client: data.data[obj].client,
                    address: data.data[obj].address,
                    datetime: data.data[obj].datetime,
                    lat: data.data[obj].lat,
                    lng: data.data[obj].lng,
                    number: data.data[obj].number,
                    id: obj,
                    diff: 0,
                    status: data.data[obj].status
                }
                cacambas.push(aux)
            })

            return cacambas

        })
        .catch(err => {
            return err
        })

    return response

}
/**
 * Retorna todas as caçambas independentemente de UID
 * @param uid 
 * @returns 
 */
const GetAllCacambas = async (): Promise<ICacambas[]> => {

    const config: AxiosRequestConfig = {
        method: 'get',
        url: `${URLNAO}/cacambas.json`
    }

    const response = await axios(config)
        .then(data => {


            const cacambas: ICacambas[] = []

            if (data.data === null || data.data === undefined) {
                return cacambas
            }

            const listObjectId = Object.keys(data.data)

            listObjectId.forEach(obj => {
                const aux: ICacambas = {
                    address: data.data[obj].address,
                    datetime: data.data[obj].datetime,
                    lat: data.data[obj].lat,
                    lng: data.data[obj].lng,
                    number: data.data[obj].number,
                    uid: data.data[obj].uid,
                    id: obj,
                    diff: 0
                }
                cacambas.push(aux)
            })

            return cacambas

        })
        .catch(err => {
            return err
        })

    return response

}

/**
 * Remove uma determinada caçamba pelo objectId da mesma
 * @param id 
 * @returns 
 */
const DelCacambas = async (id: string) => {

    const url: string = `${URLNAO}/cacambas/${id}.json`

    const config: AxiosRequestConfig = {
        method: 'delete',
        url
    }

    return axios(config)

}

/**
 * Atualiza a planilha do google planilhas com os novos dados de caçambas
 * @returns 
 */
const PutRows = (): AxiosPromise => {
    const config: AxiosRequestConfig = {
        url: 'https://us-central1-fcz-cacambas.cloudfunctions.net/server',
        method: 'get'
    }

    return axios(config)
}

const GetCep = (cep: string): AxiosPromise => {
    const config: AxiosRequestConfig = {
        url: `https://viacep.com.br/ws/${cep}/json/`,
        method: 'get'
    }

    return axios(config)
}

const PatchClients = (uid: string, iclient: IClient, id: string,) => {
    iclient.uid = uid
    iclient.id = id
    iclient.name = iclient.name?.toUpperCase()
    const objectId: objectId = {}

    objectId[id] = iclient

    const config: AxiosRequestConfig = {
        method: 'patch',
        url: `${URLNAO}/clients.json`,
        data: objectId
    }

    return axios(config)
}

/**
 * Retorna todos as caçambas colocadas pelo usuário atual da aplicação pelo uid
 * @param uid 
 * @returns 
 */
const GetAllClientsFromUID = async (uid: string): Promise<IClient[]> => {

    const config: AxiosRequestConfig = {
        method: 'get',
        url: `${URLNAO}/clients.json?orderBy="uid"&equalTo="${uid}"`
    }

    const response = await axios(config)
        .then(data => {

            const listObjectId = Object.keys(data.data)
            const clients: IClient[] = []
            listObjectId.forEach(obj => {
                const aux: IClient = {

                    insc: data.data[obj].insc,
                    name: data.data[obj].name,
                    zip: data.data[obj].zip,
                    bairro: data.data[obj].bairro,
                    cep: data.data[obj].cep,
                    localidade: data.data[obj].localidade,
                    logradouro: data.data[obj].logradouro,
                    uf: data.data[obj].uf,
                    numero: data.data[obj].numero,
                    complemento: data.data[obj].complemento,
                    fix: data.data[obj].fix,
                    cel: data.data[obj].cel,
                    uid: data.data[obj].uid,
                    id: data.data[obj].id,
                    status: data.data[obj].status
                }

                clients.push(aux)
            })

            return clients

        })
        .catch(err => {
            return err
        })

    return response

}

/**
 * 
 * @param uid Persiste o funcionários que concorrem ao recebimento do lanche diário
 * @param iemployee 
 * @param id 
 * @returns 
 */
const PatchEmployees = (uid: string, iemployee: IEmployee, id: string,) => {
    iemployee.uid = uid
    iemployee.id = id
    iemployee.name = iemployee.name?.toUpperCase()
    const objectId: objectId = {}

    objectId[id] = iemployee

    const config: AxiosRequestConfig = {
        method: 'patch',
        url: `${URLNAO}/employees.json`,
        data: objectId
    }

    return axios(config)
}

const GetAllEmployees = async (): Promise<IEmployee[]> => {

    const config: AxiosRequestConfig = {
        method: 'get',
        url: `${URLNAO}/employees.json`
    }

    const response = await axios(config)
        .then(data => {

            const listObjectId = Object.keys(data.data)
            const employees: IEmployee[] = []
            listObjectId.forEach(obj => {
                const {
                    fri,
                    id,
                    mon,
                    name,
                    registry,
                    sat,
                    sun,
                    thu,
                    tue,
                    type,
                    uid,
                    unit,
                    wed,
                    status,
                    obs,
                    rule
                } = data.data[obj]
                employees.push({
                    fri,
                    id,
                    mon,
                    name,
                    registry,
                    sat,
                    sun,
                    thu,
                    tue,
                    type,
                    uid,
                    unit,
                    wed,
                    status,
                    obs,
                    rule
                })
            })

            return employees

        })
        .catch(err => {
            return err
        })

    return response

}

/**
 * Cria ou atualiza um roteiro da coleta residencial
 * @param uid 
 * @param iemployee 
 * @param script valor do roteiro
 * @returns 
 */
const PatchScript = (uid: string, iscript: IScript, script: string) => {
    iscript.uid = uid

    const objectId: objectId = {}

    objectId[script] = iscript

    const config: AxiosRequestConfig = {
        method: 'patch',
        url: `${URLNAO}/scripts.json`,
        data: objectId
    }

    return axios(config)
}

const GetScript = async (script: string) => {
    const config: AxiosRequestConfig = {
        method: 'get',
        url: `${URLNAO}/scripts.json?orderBy="SiglaDoRoteiro"&equalTo="${script}"`
    }

    return axios(config)

}

const GetUsers = async () => {
    const config: AxiosRequestConfig = {
        method: 'get',
        url: 'https://fcz-cacambas-default-rtdb.firebaseio.com/usuarios.json'
    }

    return axios(config)

}

/**
 * Atualiza o status da última leitura de georeferenciamento para FALSE 
 * @param key 
 * @param obj 
 * @returns 
 */
const PatchLocation = (obj: any) => {

    const data: objectId = {}

    data[obj['key']] = obj

    const config = {
        url: 'https://fcz-cacambas-default-rtdb.firebaseio.com/locations.json',
        method: "patch",
        data
    }

    return axios(config)
}

/**
 * Guarda as coordenadas de uma caçamba ilegal
 * @param {*} obj 
 * @returns 
 */
const PatchCacambasLocation = (obj: any) => {

    const data: objectId = {}
    data[obj['timestamp']] = obj

    const config = {
        url: 'https://fcz-cacambas-default-rtdb.firebaseio.com/cacambas.json',
        method: "patch",
        data
    }

    return axios(config)
}

const PatchPublicidade = (obj: any) => {

    const data: objectId = {}
    data[obj["key"]] = obj


    const config = {
        url: 'https://fcz-cacambas-default-rtdb.firebaseio.com/publicidade.json',
        method: "patch",
        data
    }

    return axios(config)
}

const ReverseGeocode = (address: string) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyD74xxDFGvmO9DAGJW9pDI51J8fCQPaYDY`

    const config: AxiosRequestConfig = {
        method: 'get',
        url
    }

    return axios(config)
}

const PushNotification = (tag: string, message: string) => {
    const config: AxiosRequestConfig = {
        method: 'post',
        url: 'https://us-central1-fcz-fiscaliza.cloudfunctions.net/app',
        data: {
            tag,
            message
        }
    }

    return axios(config)
}

const GetPublicidade = () => {


    const config = {
        url: 'https://fcz-cacambas-default-rtdb.firebaseio.com/publicidade.json',
        method: "get"
    }

    return axios(config)
}

/**
 * Registra um email para envio das ordens de serviço
 * @param {*} obj 
 * @returns 
 */
const PatchEmail = (obj: any) => {

    const data: objectId = {}
    data[uid(6)] = obj

    const config = {
        url: 'https://fcz-nao-default-rtdb.firebaseio.com/email.json',
        method: "patch",
        data
    }

    return axios(config)
}

/**
 * Remove um email para envio das ordens de serviço
 * @param id 
 * @returns 
 */
const DelEmail = async (id: string) => {

    const url: string = `${URLNao}/email/${id}.json`

    const config: AxiosRequestConfig = {
        method: 'delete',
        url
    }

    return axios(config)

}

/**
 * Salva uma empresa que possui monitoramento no banco de dados do fcz-nao
 * @param empresa 
 * @returns 
 */
const InsertEmpresa = async (empresa: IDataEnterprise) => {

    const minhaColecao = collection(db, "empresas")

    return new Promise(async (resolve, reject) => {
        try {
            const docRef = await addDoc(minhaColecao, empresa)
            resolve(docRef.id)

        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 
 * @returns Retorna as empresas que possuem monitoramento
 */
const GetEmpresas = async () => {

    const minhaColecao = collection(db, "empresas")

    return new Promise(async (resolve, reject) => {
        try {
            // Obter todos os documentos da coleção
            const querySnapshot = await getDocs(minhaColecao)
            const documentos = querySnapshot.docs.map((doc) => doc.data())
            resolve(documentos)
        } catch (err) {
            reject(err)
        }
    })
}

/**
 * Insere dados de acesso para o monitoramento de uma empresa
 * @param docId 
 * @param data 
 * @returns 
 */
const InsertAcesso = async (docId: any, data: any) => {

    return new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, "empresas", docId)
            await updateDoc(docRef, {
                acessos: arrayUnion(data)
            })
            resolve(docRef)
        } catch (err) {
            reject(err)
        }
    })
}

/**
 * Remove dados de acesso para o monitoramento de uma empresa
 * @param docId 
 * @param data 
 * @returns 
 */
const RemoveAcesso = async (docId: any, data: any) => {

    return new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, "empresas", docId)
            await updateDoc(docRef, {
                acessos: arrayRemove(data)
            })
            resolve(docRef)
        } catch (err) {
            reject(err)
        }
    })
}

/**
 * 
 * @param docId Remove uma empresa monitorada, bem como todos os seus dados
 * @returns 
 */
const RemoveEmpresa = async (docId: any) => {

    return new Promise(async (resolve, reject) => {
        try {
            const itemRef = doc(collection(db, "empresas"), docId)
            await deleteDoc(itemRef)
            resolve(itemRef)
        } catch (err) {
            reject(err)
        }
    })
}

/**
 *  Atualiza as observações de uma empresa monitorada
 * @param docId id do documento na coleção
 * @param data novas observações
 * @returns 
 */
const UpdateObsEmpresa = async (docId: any, obs: any) => {

    return new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, "empresas", docId)
            await updateDoc(docRef, {
                obs
            })
            resolve(docRef)
        } catch (err) {
            reject(err)
        }
    })
}

/**
 *Incrementa um determinado número de vezes em que um grupo de relator já foi escolhido
 * @param docId 
 * @param data 
 * @returns 
 */
const IncrementGrupoRelator = async (field: string) => {

    return new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, 'relatores', '1dDQIWcNqp0fraSPksf9')
            await updateDoc(docRef, {
                [field]: increment(1)
            })
            resolve(docRef)
        } catch (err) {
            reject(err)
        }
    })
}

/**
 *Decrementa um determinado número de vezes em que um grupo de relator já foi escolhido
 * @param docId 
 * @param data 
 * @returns 
 */
const DecrementGrupoRelator = async (field: string) => {

    return new Promise(async (resolve, reject) => {
        try {
            const docRef = doc(db, 'relatores', '1dDQIWcNqp0fraSPksf9')
            await updateDoc(docRef, {
                [field]: increment(-1)
            })
            resolve(docRef)
        } catch (err) {
            reject(err)
        }
    })
}

/**
 * Retorna todos os realtores de um determinado documento
 * @param docId 
 * @returns 
 */
const GetRelatores = async () => {

    return new Promise(async (resolve, reject) => {
        try {
            const minhaColecao = collection(db, "relatores")
            const querySnapshot = await getDocs(minhaColecao)
            const documentos = querySnapshot.docs.map((doc) => doc.data())
            resolve(documentos)

        } catch (err) {
            reject(err)
        }
    })
}

/**
 * Retorna todos os acessos de emails dos grupos da OS
 * @returns 
 */
const GetEmails = async (): Promise<IEmail[] | DocumentData[]> => {

    return new Promise(async (resolve, reject) => {
        try {
            const minhaColecao = collection(db, "emails")
            const querySnapshot = await getDocs(minhaColecao)
            const documentos = querySnapshot.docs.map((doc) => doc.data())
            resolve(documentos)

        } catch (err) {
            reject(err)
        }
    })
}

/**
 * Consulta a coleção "empresas" no Firestore e retorna documentos filtrados pelo atributo 'tipo'.
 *
 * @param tipo - O valor do atributo 'tipo' pelo qual filtrar os documentos.
 * @returns Uma lista de objetos do tipo IAcesso correspondentes aos documentos filtrados.
 */
const GetEmpresasDownload = async (tipo: string): Promise<IAcesso[]> => {

    return new Promise(async (resolve, reject) => {
        try {
            const empresasRef = collection(db, "empresas")
            const q = query(empresasRef, where('tipo', '==', tipo))
            const querySnapshot = await getDocs(q)
            const documentos = querySnapshot.docs.map((doc) => doc.data())

            const empresas: IAcesso[] = []
            querySnapshot.forEach((doc) => {
                const data = doc.data() as IAcesso
                empresas.push(data)
            })

            resolve(empresas)

        } catch (err) {
            reject(err)
        }
    })
}

/**
 * Converte o conteúdo de um elemento HTML em uma imagem e faz upload para o Firebase Storage.
 *
 * @param {HTMLElement} htmlElement - O elemento HTML cujo conteúdo será convertido em uma imagem.
 * @param {string} imageName - O nome da imagem a ser salva no Firebase Storage (sem a extensão do arquivo).
 * @throws {Error} Lança um erro se houver algum problema na conversão do HTML para imagem ou no upload para o Firebase Storage.
 * @returns {Promise<void>} Uma promessa que se resolve quando a imagem é carregada com sucesso no Firebase Storage.
 */
async function saveHtmlAsImage(htmlElement: HTMLElement, imageName: string): Promise<string> {
    try {
        const dataUrl = await toPng(htmlElement)

        // Converter Data URL para Blob
        const response = await fetch(dataUrl)
        const imageBlob = await response.blob()

        // Fazer upload da imagem para o Firebase Storage
        const imageRef = ref(storage, `images/${imageName}.png`)
        const uploadTask = uploadBytesResumable(imageRef, imageBlob)
        const snapshot = await uploadTask
        const downloadURL = await getDownloadURL(snapshot.ref)

        console.log("Image uploaded to Firebase Storage:", imageName)

        return downloadURL
    } catch (error) {
        console.error("Error converting HTML to image:", error)
        throw error
    }
}

/**
 * Salva ou atualiza os dados de um polígono no Firestore.
 * Se o documento com o polygonId fornecido já existir na coleção "poligonos",
 * a função atualizará os dados do documento existente.
 * Caso contrário, a função criará um novo documento com os dados fornecidos.
 *
 * @async
 * @function saveOrUpdatePolygonData
 * @param {IFirestoreEnvio} data - Objeto que contém os dados do polígono a serem salvos ou atualizados.
 * @param {string} polygonId - ID do polígono a ser usado como identificador do documento no Firestore.
 * @throws {Error} Lança um erro se ocorrer algum problema ao salvar ou atualizar os dados no Firestore.
 * @example
 * // Salva ou atualiza os dados do polígono no Firestore
 * await saveOrUpdatePolygonData(polygonData, 'polygon-123')
 */
async function saveOrUpdatePolygonData(data: IFirestoreEnvio, polygonId: string) {
    data.polys = JSON.stringify(data.polys)
    const polygonsRef = collection(db, "poligonos")
    const polygonDocRef = doc(polygonsRef, polygonId)

    const docSnapshot = await getDoc(polygonDocRef)

    if (docSnapshot.exists()) {
        // Atualiza os dados do documento existente
        await updateDoc(polygonDocRef, data)
    } else {
        // Cria um novo documento com os dados fornecidos
        await setDoc(polygonDocRef, data)
    }
}

/**
 * Retorna os documentos da coleção "poligonos" com o atributo "data" igual ao valor fornecido.
 *
 * @param {number} data - Valor do atributo "data" para filtrar os resultados.
 * @returns {Promise<IFirestoreEnvio[]>} Lista de documentos da coleção "poligonos" com o atributo "data" igual ao valor fornecido.
 */
async function getPolygonsByDate(data: string): Promise<IFirestoreEnvio[]> {
    const polygonsRef = collection(db, 'poligonos')
    const polygonsQuery = query(polygonsRef, where('date', '==', data))
    const querySnapshot = await getDocs(polygonsQuery)

    const polygonsData: IFirestoreEnvio[] = []

    querySnapshot.forEach((doc) => {
        const data = doc.data() as IFirestoreEnvio
        polygonsData.push(data)
    })

    return polygonsData
}

/**
 * Retorna os documentos da coleção "poligonos" com o atributo "key" igual ao valor fornecido.
 *
 * @param {number} key - Valor do atributo "key" para filtrar os resultados.
 * @returns {Promise<IFirestoreEnvio[]>} Lista de documentos da coleção "poligonos" com o atributo "data" igual ao valor fornecido.
 */
async function getPolygonsByKey(key: string): Promise<IFirestoreEnvio[]> {
    const polygonsRef = collection(db, 'poligonos')
    const polygonsQuery = query(polygonsRef, where('key', '==', key))
    const querySnapshot = await getDocs(polygonsQuery)

    const polygonsData: IFirestoreEnvio[] = []

    querySnapshot.forEach((doc) => {
        const data = doc.data() as IFirestoreEnvio
        polygonsData.push(data)
    })

    return polygonsData
}

/**
 * Retorna todos os documentos da coleção "poligonos".
 *
 * @returns {Promise<IFirestoreEnvio[]>} Lista de documentos da coleção "poligonos".
 */
async function getAllPolygons(): Promise<IFirestoreEnvio[]> {

    const polygonsRef = collection(db, 'poligonos')
    const querySnapshot = await getDocs(polygonsRef)

    const polygonsData: IFirestoreEnvio[] = []

    querySnapshot.forEach((doc) => {
        const data = doc.data() as IFirestoreEnvio
        polygonsData.push(data)
    })

    return polygonsData
}

/**
 * Componente para fazer upload de um arquivo PDF para o Firebase Storage e
 * salvar a URL de download no Firestore.
 */
const handleUpload = async (file: File | null, setUploading: any) => {

    return new Promise(async (resolve, reject) => {
        if (!file) {
            alert("Selecione um arquivo PDF para fazer upload.")
            return
        }

        setUploading(true)
        try {
            const pdfRef = ref(storage, `pdfs/${file.name}`)
            await uploadBytes(pdfRef, file)
            const downloadURL = await getDownloadURL(pdfRef)

            const pdfDoc = doc(db, "pdfs", file.name)
            await setDoc(pdfDoc, { url: downloadURL })
            setUploading(false)
            resolve(downloadURL)

        } catch (error) {
            reject(error)
        }

    })


}

export { getPolygonsByKey, handleUpload, getPolygonsByDate, getAllPolygons, saveOrUpdatePolygonData, saveHtmlAsImage, GetEmpresasDownload, GetEmails, IncrementGrupoRelator, DecrementGrupoRelator, GetRelatores, UpdateObsEmpresa, RemoveEmpresa, RemoveAcesso, InsertAcesso, GetEmpresas, InsertEmpresa, DelEmail, PatchEmail, GetOrdem, InsertAproveOS, UpdateAcessos, GetAcessos, GetBases, InsertItemOpcoes, RemoveItemOpcoes, GetOpcoes, GeocoderAsync, DeleteOrdem, GetDayOrdem, InsertOrdem, GetNumeroOrdem, GetPublicidade, PatchPublicidade, PushNotification, ReverseGeocode, PatchCacambasLocation, PatchLocation, GetScript, PatchScript, GetAllEmployees, PatchEmployees, GetAllClientsFromUID, PatchClients, GetCep, PutRows, GetUser, GetAllUser, PatchEmpresaCacambas, GetAllEmpresas, Geocoder, PatchCacambas, GetAllCacambasPeloUID, DelCacambas, PatchUser, GetAllCacambas, GetUsers }


