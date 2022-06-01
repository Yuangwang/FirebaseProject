import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LoginPage from "./loginpage";
import UsersLists from "./userslists";
import { useState } from "react"

const root = document.getElementById("root");

const [uid, setUID] = useState(null);
render(<BrowserRouter>
  <Routes>
    <Route path="/" element={<LoginPage uid={uid} setUID={setUID} />} />
    <Route path="/signedIn" element={<UsersLists uid={uid} setUID={setUID} />} />
  </Routes>
</BrowserRouter>, root);