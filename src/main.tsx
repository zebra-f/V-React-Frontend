import React from "react";
import ReactDOM from "react-dom/client";
import ColorModeApp from "./styles/ColorModeApp";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ColorModeApp />
    </BrowserRouter>
  </React.StrictMode>
);
