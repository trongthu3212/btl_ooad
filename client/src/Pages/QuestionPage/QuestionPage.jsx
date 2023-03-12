import Sidebar from "../../Layouts/Sidebar/Sidebar";
import styles from "./QuestionPage.module.scss";
import { Navigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { useState, useEffect } from "react";
import { getPost } from "../../Api/question-api";
import { Skeleton } from "@mui/material";

function QuestionPage() {
    let { idQuestion } = useParams();
    const [comment, setComment] = useState();
    const [question, setQuestion] = useState();

    const [askedTime, setAskedTime] = useState("");

    useEffect(() => {
        getPost(idQuestion).then((res) => {
            setQuestion(res);
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
                                className="btn btn-primary"
                                onClick={openAskQuestion}
                            >
                                Đặt câu hỏi
                            </button>
                        </div>
                        <div className="d-flex justify-content-start mb-1 gap-3">
                            <div><span>Thời gian hỏi</span> <span>{askedTime}</span></div>
                            <div><span>Thời gian chỉnh sửa</span> <span>{askedTime}</span></div>
                            <div><span>Đã xem</span> <span>{askedTime}</span></div>
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
