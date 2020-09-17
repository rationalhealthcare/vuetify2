import firebase from "firebase/app";
import "firebase/auth";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCyoloz1UWwCTW33TLRbABNlP-CMI77pbw",
  authDomain: "mymvp-80b4b.firebaseapp.com",
  databaseURL: "https://mymvp-80b4b.firebaseio.com",
  projectId: "mymvp-80b4b",
  storageBucket: "mymvp-80b4b.appspot.com",
  messagingSenderId: "359098940774",
  appId: "1:359098940774:web:a9de4858b95971a4259ca7",
  measurementId: "G-6QSHNW860E"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
