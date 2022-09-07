import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

import { DonateApp } from "./DonateApp";
const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <DonateApp />
  </StrictMode>,
  rootElement
);
