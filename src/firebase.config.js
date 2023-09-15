// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAr3x7ajI1b6uEP3k7nxCXQAE89hMUrvLo",
	authDomain: "house-marketplace-app-subho.firebaseapp.com",
	projectId: "house-marketplace-app-subho",
	storageBucket: "house-marketplace-app-subho.appspot.com",
	messagingSenderId: "562151954319",
	appId: "1:562151954319:web:7b11ddfb38faf3c6521dfa",
	measurementId: "G-2DT32T0K5V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore();
