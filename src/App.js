import React from "react";
import { Routes, Route } from "react-router-dom";
import UsersLists from "./userslists";
import LoginPage from "./loginpage";
// import { setupFirebaseAndUID } from "./firebaseUtils";
import TodoList from "./todolist";
import { setupAws } from "./awsUtils";

export const ServerContext = React.createContext();
function App() {
  // setupFirebaseAndUID uses firebase to get a UID and sets it properly in the database
  // const { db, auth, storage } = setupFirebaseAndUID({ setUID });
  const { auth, db, storage } = setupAws();
  return (
    <ServerContext.Provider value={{ auth, db, storage }}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signedIn" element={<UsersLists />} />
        <Route path="/todoList" element={<TodoList />} />
      </Routes>
    </ServerContext.Provider>
  );
}

export default App;
