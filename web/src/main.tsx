import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  
  <StrictMode>
    <head>
      <link rel="stylesheet" href="https://use.typekit.net/vxy8tas.css"></link>
      <link rel="stylesheet" href="https://use.typekit.net/jge8wgr.css"></link>
      <link rel="stylesheet" href="https://use.typekit.net/lnm5qra.css"></link>
    </head>
    <App />
  </StrictMode>,
);
