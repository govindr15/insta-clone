import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig={
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        apiKey: "AIzaSyAQuRhdSfgnF4HE2CZKXFVNAmtmHCvWOUs",
        authDomain: "insta-clone-d3ac0.firebaseapp.com",
        projectId: "insta-clone-d3ac0",
        storageBucket: "insta-clone-d3ac0.appspot.com",
        messagingSenderId: "1066561839578",
        appId: "1:1066561839578:web:d9caf913a57993c82220e3",
        measurementId: "G-SNL68C1Z22"
};

const firebaseApp=initializeApp
  (firebaseConfig);
  
  const db=getFirestore(firebaseApp);
  const auth=getAuth(firebaseApp);
  const storage=getStorage();

export  { auth, storage };
export default db;