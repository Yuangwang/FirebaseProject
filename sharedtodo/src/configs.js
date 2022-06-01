import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// Configure Firebase
export const firebaseConfig = {
    apiKey: "AIzaSyBrGClPxOIHiimdpauAp7u3PJSjViTnAg0",
    authDomain: "fir-demo-da4db.firebaseapp.com",
    projectId: "fir-demo-da4db",
    storageBucket: "fir-demo-da4db.appspot.com",
    messagingSenderId: "35391424327",
    appId: "1:35391424327:web:7720a8f8161d84c8f82e62",
    measurementId: "G-BDM47250M8"
};
// Configure FirebaseUI.
export const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/signedIn',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
};