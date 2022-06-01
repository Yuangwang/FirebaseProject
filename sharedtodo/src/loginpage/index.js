import { initializeApp } from 'firebase/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { getAuth } from "firebase/auth";
import { firebaseConfig, uiConfig } from "../configs"

function LoginPage() {

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    return (
        <div>
            <h1>Collaborative TODO</h1>
            <p>Please sign-in:</p>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={getAuth(app)} />
        </div>
    );
}

export default LoginPage;
