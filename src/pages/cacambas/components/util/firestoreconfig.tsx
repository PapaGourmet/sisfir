import { getFirestore, collection, addDoc, doc, getDoc, setDoc, query, where, getDocs, updateDoc, deleteDoc, } from "firebase/firestore"
import { initializeApp } from "firebase/app"
import firebaseNAOConfig from "../../../../util/firebase-nao-config"

const app = initializeApp(firebaseNAOConfig, "cacs")
const dbDatabaseFirestoreNao = getFirestore(app)

export default dbDatabaseFirestoreNao