import React from "react";
import { Routes, Route } from "react-router-dom";
import UsersLists from "./userslists";
import LoginPage from "./loginpage";
import { useState } from "react"
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "./configs"

function App() {

    const [uid, setUID] = useState(null);
    const app = initializeApp(firebaseConfig);

    const auth = getAuth(app);


    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUID(user.uid);
            debugger
        } else {
            setUID(null);
        }
    });
    return (
        <Routes>
            <Route path="/" element={<LoginPage uid={uid} setUID={setUID} />} />
            <Route path="/signedIn" element={<UsersLists uid={uid} setUID={setUID} />} />
        </Routes>
    );
}

export default App;
