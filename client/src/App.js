import React from "react";
import Header from "./Layouts/Header/Header";
import Footer from "./Layouts/Footer/Footer";
import { HomePage } from "./Pages/pages";

function App() {
    return (
        <React.Fragment>
            <Header />
            <HomePage />
            <Footer />
        </React.Fragment>
    );
}

export default App;
