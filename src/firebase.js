import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVmiLOThQPhvtdhWlsD3IpH_OFqT7TJ8s",
  authDomain: "iotresearchlab-4411a.firebaseapp.com",
  projectId: "iotresearchlab-4411a",
  storageBucket: "iotresearchlab-4411a.appspot.com",
  messagingSenderId: "382353742525",
  appId: "1:382353742525:web:4e40196fe22e71e49875d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);



const auth = getAuth(app);
// Initialize Firebase Storage
const storage = getStorage(app);

export { auth, storage };
