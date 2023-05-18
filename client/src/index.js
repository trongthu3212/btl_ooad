import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Auth/AuthProvider";
import axios from "axios";
import { SearchProvider } from "SearchContext/SearchProvider";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AuthProvider>
        <SearchProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </SearchProvider>
    </AuthProvider>
);
