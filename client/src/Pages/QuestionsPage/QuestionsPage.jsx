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

    // Lấy dữ liệu câu hỏi
    useEffect(() => {
      getAllPosts().then(res => {
        setData(res);
        setIsLoading(false);
      })
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

			<div className="container">
				<nav className="navbar">
					<div className="container-fluid">
						<a className="navbar-brand" href="#">
							<h1>Tất cả câu hỏi</h1>
						</a>
						<button
							className="btn btn-primary"
							onClick={openAskQuestion}
						>
							Đặt câu hỏi
						</button>
					</div>
				</nav>

				<div className="d-flex justify-content-end">
					<div class="btn-group">
						<button type="button" class="btn btn-outline-secondary">
							Mới nhất
						</button>
						<button type="button" class="btn btn-outline-secondary">
							Đang hoạt động
						</button>
						<button type="button" class="btn btn-outline-secondary">
							Được treo thưởng
						</button>
						<button type="button" class="btn btn-outline-secondary">
							Chưa trả lời
						</button>
						<button id="btnGroupDrop1" type="button" class="btn btn-outline-secondary dropdown-toggle"
							aria-expanded="false" data-bs-toggle="dropdown">
							Thêm
						</button>
						<ul class="dropdown-menu" aria-labelledby="btnGroupDrop1">
							<li>
								<a class="dropdown-item" href="#">
									Dropdown link
								</a>
							</li>
							<li>
								<a class="dropdown-item" href="#">
									Dropdown link
								</a>
							</li>
						</ul>
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
									key={obj._id}
								>
									<Link to={obj._id} className={styles.title}>
										{obj.title}
									</Link>
									<div className={styles.content}>
										{obj.content}
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
