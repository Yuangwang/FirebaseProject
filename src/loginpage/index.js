import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { useContext } from "react";
import { uiConfig } from "../configs";
import styled from "styled-components";
import { ServerContext } from "../App";
const Wrapper = styled.div`
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
function LoginPage() {
  const { auth } = useContext(ServerContext);
  return (
    <Wrapper>
      <h1>Welcome to Todo Collab</h1>
      <p>Please sign-in:</p>
      {/* this is firebase auth specific, swap this out with other products auth, 
            its responsible for showing the login box and calling onAuthStateChanged when auth state changes */}
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </Wrapper>
  );
}

export default LoginPage;
