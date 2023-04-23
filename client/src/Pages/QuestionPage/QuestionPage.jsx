import Sidebar from "../../Layouts/Sidebar/Sidebar";
import styles from "./QuestionPage.module.scss";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { useState, useEffect } from "react";
import { getComment, getPost } from "../../Api/question-api";
import { Skeleton } from "@mui/material";
import moment from "moment/moment";
import 'moment/locale/vi'

function QuestionPage() {
    let { idQuestion } = useParams();

    const navigate = useNavigate();

    const [comment, setComment] = useState();
    const [question, setQuestion] = useState();

    const [askedTime, setAskedTime] = useState("");

    const [myAnswer, setMyAnswer] = useState("");

    useEffect(() => {
        getPost(idQuestion).then((res) => {
            setQuestion(res);
            setAskedTime(res.createdAt);
        });
        getComment(idQuestion).then((res) => {
            setComment(res);
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
         * Điều hướng sang trang câu hỏi
         */
    function openAskQuestion() {
        navigate("/questions/ask");
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


    /**
     * Post câu trả lời
     */
    function postAnswer() {

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
                            <div><span className="text-blur">Lượt xem</span> <span></span></div>
                        </div>
                        <div></div>
                    </div>
                    <div className={styles["question-content"]}>
                        <div className={styles.voteSection}>
                            <button className={styles.btnVote}>
                                <svg aria-hidden="true" className="svg-icon iconArrowUpLg" width="36" height="36" viewBox="0 0 36 36"><path d="M2 25h32L18 9 2 25Z"></path></svg>
                            </button>
                            <div className={styles.voteCount}>{question?.score}</div>
                            <button className={styles.btnVote}>
                                <svg aria-hidden="true" className="svg-icon iconArrowDownLg" width="36" height="36" viewBox="0 0 36 36"><path d="M2 11h32L18 27 2 11Z"></path></svg>
                            </button>
                        </div>
                        <div className={`${styles.questionDetail} flex-grow-1`}>
                            <div className={styles.content}>
                                {question ? question.content
                                    : <>
                                        <Skeleton animation="wave" variant="rounded" width="100%" />
                                        <Skeleton animation="wave" variant="rounded" width="80%" />
                                        <Skeleton animation="wave" variant="rounded" width="100%" height={300} />
                                        <Skeleton animation="wave" variant="rounded" width="100%" />
                                        <Skeleton animation="wave" variant="rounded" width="100%" />
                                        <Skeleton animation="wave" variant="rounded" width="40%" />
                                    </>
                                }    
                            </div>
                            {question ? <div className={styles.postTag}>
                                <div className={styles.tag}>{question.course?.code}</div>
                                <div className={styles.tag}>{question.course?.name}</div>
                            </div> 
                            : <div className={styles.postTag}>
                                <Skeleton animation="wave" variant="rounded" width={80} height={20} />
                                <Skeleton animation="wave" variant="rounded" width={80} height={20} />
                            </div>
                            }
                            <div className={styles.userInfo}>
                                {question ? <img src="" alt="" width={32} height={32} className={styles.avatar} />
                                : <Skeleton animation="wave" variant="circular" width={32} height={32} />}
                                <div className={styles.userDetail}>
                                    {question ? <a href="">{question?.author.username}</a>
                                    : <Skeleton animation="wave" variant="rounded" width={80} height={20} />}
                                    <div className={styles.reputationScore}></div>
                                </div>
                            </div>
                            <div className={styles.commentSection}>
                                {comment ? (
                                    (comment.map((obj, idx) => (
                                        <div key={idx} className={styles.comment}>
                                            <span>{obj.content}</span> - <a href="#">{obj.author?.username}</a>
                                        </div>
                                    )))
                                ) : 
                                <Skeleton animation="wave" variant="rounded" width="100%" />}
                            </div>
                            <div className={styles.addComment}>
                                Thêm bình luận
                            </div>
                        </div>
                    </div>
                    {question?.answers && question.answers.length > 0 &&
                        <div className={styles.answerSection}>
                            <h2 className={styles.countAnswer}>
                                {question.answers.length} câu trả lời
                            </h2>
                            {question.answers.map((answer, idx) => (
                                <div className={styles["question-content"]} key={idx}>
                                    <div className={styles.voteSection}>
                                        <button className={styles.btnVote}>
                                            <svg aria-hidden="true" className="svg-icon iconArrowUpLg" width="36" height="36" viewBox="0 0 36 36"><path d="M2 25h32L18 9 2 25Z"></path></svg>
                                        </button>
                                        <div className={styles.voteCount}>0</div>
                                        <button className={styles.btnVote}>
                                            <svg aria-hidden="true" className="svg-icon iconArrowDownLg" width="36" height="36" viewBox="0 0 36 36"><path d="M2 11h32L18 27 2 11Z"></path></svg>
                                        </button>
                                    </div>
                                    <div className={`${styles.questionDetail} flex-grow-1`}>
                                        <div className={styles.content}>
                                            {answer.content}
                                        </div>
                                        <div className={styles.userInfo}>
                                            <img src="" alt="" width={32} height={32} className={styles.avatar} />
                                            <div className={styles.userDetail}>
                                                <a href="">{answer.author.username}</a>
                                                <div className={styles.reputationScore}></div>
                                            </div>
                                        </div>
                                        <div className={styles.commentSection}>
                                            {comment ? (
                                                (comment.map((obj, idx) => (
                                                    <div key={idx} className={styles.comment}>
                                                        <span>{obj.content}</span> - <a href="#">{obj.author?.username}</a>
                                                    </div>
                                                )))
                                            ) :
                                                <Skeleton animation="wave" variant="rounded" width="100%" />}
                                        </div>
                                        <div className={styles.addComment}>
                                            Thêm bình luận
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                    <div className={`${styles.answerSection} ${styles.myAnswer}`} data-color-mode="light">
                        <h2 className={styles.countAnswer}>
                            Câu trả lời của bạn
                        </h2>
                        <MDEditor value={myAnswer} onChange={setMyAnswer} height="250" />
                        <button
                            className={`btn btn-primary d-flex align-items-center ${styles.btnAskQuestion}`}
                            onClick={postAnswer}
                        >
                            Trả lời
                        </button>
                    </div>
				</div>
			</div>
		</div>
	);
}

export default QuestionPage;
