import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";

const root = document.getElementById("root");
render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  root
);
