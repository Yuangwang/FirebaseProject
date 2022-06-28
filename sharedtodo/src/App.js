import React from "react";
import { Routes, Route } from "react-router-dom";
import UsersLists from "./userslists";
import LoginPage from "./loginpage";
import { useState } from "react"
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "./configs"
import { getDatabase, ref, set } from "firebase/database";
import TodoList from "./todolist";

export const FirebaseContext = React.createContext();
function App() {

    const [uid, setUID] = useState(null);
    const app = initializeApp(firebaseConfig);
    const FirebaseContext = React.createContext();

    const auth = getAuth(app);
    const db = getDatabase(app)


    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUID(user.uid);
            set(ref(db, 'accounts/' + user.email.replaceAll(".", ",")), user.uid);
            set(ref(db, 'accounts_to_email/' + user.uid), user.email.replaceAll(".", ","));
        } else {
            setUID(null);
        }
    });
    return (
        <FirebaseContext.Provider value={{ db, auth }}>
            <Routes>
                <Route path="/" element={<LoginPage uid={uid} setUID={setUID} />} />
                <Route path="/signedIn" element={<UsersLists uid={uid} setUID={setUID} />} />
                <Route path="/todoList" element={<TodoList uid={uid} />} />
            </Routes>
        </ FirebaseContext.Provider>
    );
}

export default App;
