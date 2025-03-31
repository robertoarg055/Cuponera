import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBmYGi5VbaevnT32lEwGFH0MCk8wJXoQvA",
    authDomain: "cuponera---desarrollo-web-ii.firebaseapp.com",
    projectId: "cuponera---desarrollo-web-ii",
    storageBucket: "cuponera---desarrollo-web-ii.appspot.com",
    messagingSenderId: "1046010828508",
    appId: "1:1046010828508:web:2c0fa1007e648e5c63c7b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); 
export default app;
