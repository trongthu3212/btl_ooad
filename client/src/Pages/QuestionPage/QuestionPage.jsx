import Sidebar from "../../Layouts/Sidebar/Sidebar";
import styles from "./QuestionPage.module.scss";
import { Navigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { useState, useEffect } from "react";
import { getPost } from "../../Api/question-api";
import { Skeleton } from "@mui/material";
import moment from "moment/moment";
import 'moment/locale/vi'

function QuestionPage() {
    let { idQuestion } = useParams();
    const [comment, setComment] = useState();
    const [question, setQuestion] = useState();

    const [askedTime, setAskedTime] = useState("");

    useEffect(() => {
        getPost(idQuestion).then((res) => {
            setQuestion(res);
            setAskedTime(res.createdAt);
        });

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
         * Điều hướng sang trang câu hỏi
         */
    function openAskQuestion() {
        Navigate("/questions/ask");
    }

    /**
     * chuyển đổi ngày tháng dạng ... ngày trước
     */
    function convertDate(stringDate) {
        if (!stringDate) {
            return "";
        }
        let date = new Date(stringDate);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        let year = date.getFullYear();
        moment.locale("vi");
        return moment(`${year}${month}${date}`, "YYYYMMDD").fromNow();
    }

    return (
		<div className={styles["question-page"]}>
			<Sidebar />
			<div className="w-100">
				<div className={styles["container"]}>
                    <div className={`${styles["header"]} d-flex flex-column`}>
                        <div className="d-flex justify-content-between align-items-center">
                            <h2 className="title">{question ? question.title
                                : <Skeleton animation="wave" width={300} height={32} />}</h2>
                            <button
                                className={`btn btn-primary d-flex align-items-center ${styles.btnAskQuestion}`}
                                onClick={openAskQuestion}
                            >
                                Đặt câu hỏi
                            </button>
                        </div>
                        <div className="d-flex justify-content-start mb-1 gap-3">
                            <div><span className="text-blur">Thời gian hỏi</span> <span>{convertDate(askedTime)}</span></div>
                            <div><span className="text-blur">Thời gian chỉnh sửa</span> <span></span></div>
                            <div><span className="text-blur">Đã xem</span> <span></span></div>
                        </div>
                        <div></div>
                    </div>
                    <div className={styles["question-content"]}>
                        {question ? question.content
                            : <Skeleton animation="wave" variant="rounded" width="100%" height={600} /> }
                    </div>
				</div>
			</div>
		</div>
	);
}

export default QuestionPage;
