import { Link } from "react-router-dom";
import "./Sidebar.scss";

function Sidebar({ namePage }) {
    return (
        <div className="sidebar">
            <div className="sidebar-nav">
                <Link to="/">Home</Link>
                <p>PUBLIC</p>
                <Link
                    to="/questions"
                    className={namePage === "questions" ? "target-active" : ""}
                >
                    Questions
                </Link>
                <Link
                    to="/"
                    className={namePage === "tags" ? "target-active" : ""}
                >
                    Tags
                </Link>
                <Link
                    to="/"
                    className={namePage === "users" ? "target-active" : ""}
                >
                    Users
                </Link>
            </div>
        </div>
    );
}

export default Sidebar;
