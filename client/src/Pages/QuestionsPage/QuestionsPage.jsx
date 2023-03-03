import Sidebar from "../../Layouts/Sidebar/Sidebar";
import styles from "./QuestionsPage.module.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { useEffect, useState } from "react";
import { getAllPosts } from "../../Api/question-api";
import Loader from "../../Components/Loader/Loader";
import { useNavigate } from "react-router-dom";

function QuestionsPage() {
    const navigate = useNavigate();

    // dữ liệu câu hỏi
    const [data, setData] = useState([]);

    // Cờ check loading
    const [isLoading, setIsLoading] = useState(true);

    // Lấy dữ liệu câu hỏi
    useEffect(() => {
      getAllPosts().then(res => {
        setData(res);
        setIsLoading(false);
      })
    }, []);
    

    /**
     * Điều hướng sang trang câu hỏi
     */
    function openAskQuestion() {
        navigate("/questions/ask");
    }

    return (
        <div className={styles["questions-page"]}>
            <Sidebar />

            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#"><h4>All Questions</h4></a>
                    </div>
                    <button className="btn btn-primary active" onClick={openAskQuestion}>Ask question</button>
                </nav>

                <div className={styles.menu}>
                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Active</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Bountied</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Unanswered</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">More</a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Frequent</a></li>
                                <li><a className="dropdown-item" href="#">Score</a></li>
                                <li><a className="dropdown-item" href="#">Unanswered (my tags)</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#">Custom filter</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className={styles["list-question"]}>
                    {isLoading ? <Loader />
                        : data.map((obj, index) => {
                            return (
                                <div className={styles["preview-question"]} key={index}>
                                    <div className={styles.title}>{obj.title}</div>
                                    <div className={styles.content}>{obj.content}</div>
                                </div>
                            )
                        })}
                </div>
                
            </div>



        </div>
    );
}

export default QuestionsPage;
