import { initializeApp } from 'firebase/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { getAuth } from "firebase/auth";
import { firebaseConfig, uiConfig } from "../configs"
import styled from "styled-components"

const Wrapper = styled.div`
    margin-top:200px;
    display:flex;
    flex-direction:column;
    align-items:center;

`
function LoginPage() {

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    return (
        <Wrapper>
            <h1>Welcome to Todo Collab</h1>
            <p>Please sign-in:</p>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={getAuth(app)} />
        </Wrapper>
    );
}

export default LoginPage;
