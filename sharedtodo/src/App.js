import React from "react";
import { Routes, Route } from "react-router-dom";
import UsersLists from "./userslists";
import LoginPage from "./loginpage";
import { useState } from "react"
import { setupFirebaseAndUID } from "./firebaseUtils";
import TodoList from "./todolist";

export const ServerContext = React.createContext();
function App() {

    // UID is used to track the user logged in with auth
    const [uid, setUID] = useState(null);
    // setupFirebaseAndUID uses firebase to get a UID and sets it properly in the database
    const {db, auth, storage} = setupFirebaseAndUID({setUID});
    return (
        <ServerContext.Provider value={{ db, auth, storage }}>
            <Routes>
                <Route path="/" element={<LoginPage uid={uid} setUID={setUID} />} />
                <Route path="/signedIn" element={<UsersLists uid={uid} setUID={setUID} />} />
                <Route path="/todoList" element={<TodoList uid={uid} />} />
            </Routes>
        </ ServerContext.Provider>
    );
}

export default App;
