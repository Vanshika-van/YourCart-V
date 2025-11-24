import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from 'react-router-dom';
import "./index.css";
import UserContextProvider from './context/UserContext.jsx';
import ShopContext from "./context/ShopContext.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <UserContextProvider>
    <ShopContext>
            <App />
            </ShopContext>
            </UserContextProvider>
            </BrowserRouter>
      
  </React.StrictMode>
);
