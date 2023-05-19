import Cookies from "js-cookie";
import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getCurrentUser } from "./Api/user-api";
import AuthContext from "./Auth/AuthProvider";
import RequireAuth from "./Auth/RequireAuth";
import Footer from "./Layouts/Footer/Footer";
import Header from "./Layouts/Header/Header";
import {
    AdminPage,
    AskQuestionPage,
    HomePage,
    LoginPage,
    NotFoundPage,
    QuestionPage,
    QuestionsPage,
    SignupPage,
    UserProfilePage,
} from "./Pages/pages";

function App() {
    const { setAuth } = useContext(AuthContext);

    useEffect(() => {
        Cookies.get("connect.sid") &&
            getCurrentUser().then((currentUser) => {
                setAuth(currentUser);
            });
    }, []);

    return (
        <React.Fragment>
            <Header />
            <ToastContainer
                position="top-center"
                autoClose={3000}
                transition={Slide}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
                theme="colored"
            />
            <Routes>
                {/* public routes */}
                <Route index element={<HomePage />} />
                <Route path="users">
                    <Route path="login" element={<LoginPage />} />
                    <Route path="signup" element={<SignupPage />} />
                    <Route path=":idUser" element={<UserProfilePage />} />
                </Route>
                <Route path="questions">
                    <Route index element={<QuestionsPage />} />
                    <Route path="ask" element={<AskQuestionPage />} />
                </Route>
                <Route path="question">
                    <Route path=":idQuestion" element={<QuestionPage />} />
                    <Route path="edit/:idQuestion" element={<AskQuestionPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />

                {/* protected routes */}
                <Route element={<RequireAuth allowedRole="admin" />}></Route>

                <Route path="admin" element={<AdminPage />} />
            </Routes>

            <Footer />
        </React.Fragment>
    );
}

export default App;
