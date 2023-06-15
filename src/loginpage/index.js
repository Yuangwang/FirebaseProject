import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { useContext } from "react";
import styled from "styled-components";
import { ServerContext } from "../App";
import { Navigate } from "react-router-dom";


import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const Wrapper = styled.div`
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
function LoginPage({ signOut, user }) {
  const { auth } = useContext(ServerContext);
  auth.currentSession()
  console.log(auth.currentSession());
  return (
    <Navigate to="/signedIn" />
  );
}

export default withAuthenticator(LoginPage);
