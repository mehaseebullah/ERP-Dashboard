import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/tailwind.css";
import "./assets/css/index.css";
import { RenderRoutes } from "./routes";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RenderRoutes />
  </React.StrictMode>
);
