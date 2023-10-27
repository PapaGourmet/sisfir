import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import firebaseConfig from "../../../../util/firebase-config"

const app = initializeApp(firebaseConfig, "employees")
const firebaseDatabase = getDatabase(app)

export default firebaseDatabase