import Sidebar from "../../Layouts/Sidebar/Sidebar";
import styles from "./QuestionsPage.module.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { useEffect, useState } from "react";
import { getAllPosts } from "../../Api/question-api";
import Loader from "../../Components/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

function QuestionsPage() {
    const navigate = useNavigate();

    // dữ liệu câu hỏi
    const [data, setData] = useState([]);

    // Cờ check loading
    const [isLoading, setIsLoading] = useState(true);

    // Lọc câu hỏi theo trạng thái
    const [state, setState] = useState("newest");

    useEffect(() => {
        // Lấy dữ liệu câu hỏi
        getAllPosts().then(res => {
            setData(res);
            setIsLoading(false);
        })
        let leftSidebar = document.querySelector(".sidebar-nav");
        let footer = document.querySelector('.footer');

        window.addEventListener('scroll', handleScroll);

        // Xử lý khi scroll
        function handleScroll() {
            let topFooter = footer.getBoundingClientRect().top;
            let heightFooter = window.innerHeight - topFooter;
            if (topFooter >= window.innerHeight) {
                leftSidebar.style.top = '74px';
            } else {
                leftSidebar.style.top = 74 - heightFooter + "px";
            }
        }
      
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    /**
     * Thay đổi nhóm câu hỏi
     * @param {*} e 
     * @param {*} newVal 
     */
    function handleState(e, newVal) {
        setState(newVal);
    }

    /**
     * Điều hướng sang trang câu hỏi
     */
    function openAskQuestion() {
        navigate("/questions/ask");
    }

    return (
		<div className={styles["questions-page"]}>
			<Sidebar />

			<div className={`${styles["main-content"]} flex-fill`}>
                <div className={styles["header-content"]}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="title">Tất cả câu hỏi</h2>
                        <button
                            className={`btn btn-primary d-flex align-items-center ${styles.btnAskQuestion}`}
                            onClick={openAskQuestion}
                        >
                            Đặt câu hỏi
                        </button>
                    </div>
    
                    <div className="d-flex justify-content-end">
                        <div className="btn-group">
                            <button type="button" className="btn btn-outline-secondary">
                                Mới nhất
                            </button>
                            <button type="button" className="btn btn-outline-secondary">
                                Chưa trả lời
                            </button>
                        </div>
                    </div>
                </div>

				<div className={styles["list-question"]}>
					{isLoading ? (
						<Loader />
					) : (
						data.map((obj) => {
							return (
								<div
									className={styles["preview-question"]}
									key={obj.id}
								>
									<Link to={obj.id} className={styles.title}>
										{obj.title}
									</Link>
									<div className={styles.content}>
										{obj.shortDescription}
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
}

export default QuestionsPage;
