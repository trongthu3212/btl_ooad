import React from "react";
import Header from "./Layouts/Header/Header";
import Footer from "./Layouts/Footer/Footer";
import {
    HomePage,
    LoginPage,
    SignupPage,
    QuestionsPage,
    NotFoundPage,
} from "./Pages/pages";
import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <React.Fragment>
            <Header />

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="users">
                    <Route path="login" element={<LoginPage />} />
                    <Route path="signup" element={<SignupPage />} />
                </Route>
                <Route path="questions" element={<QuestionsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>

            <Footer />
        </React.Fragment>
    );
}

export default App;
