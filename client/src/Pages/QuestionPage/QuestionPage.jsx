import Sidebar from "../../Layouts/Sidebar/Sidebar";
import styles from "./QuestionPage.module.scss";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { useState, useEffect, useContext } from "react";
import { getComment, getPost, increasePostView } from "../../Api/question-api";
import { Skeleton } from "@mui/material";
import moment from "moment/moment";
import 'moment/locale/vi'
import AuthContext from "Auth/AuthProvider";

function QuestionPage() {
    let { idQuestion } = useParams();
    const {auth} = useContext(AuthContext);

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

        increasePostView(idQuestion);

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
    function convertDateBefore(stringDate) {
        if (!stringDate) {
            return "";
        }
        moment.locale("vi");
        return moment(stringDate).fromNow();
    }

    /**
     * Chuyển đổi ngày tháng theo format vi
     */
    function convertDateTime(stringDate) {
        if (!stringDate) {
            return "";
        }
        return moment(stringDate).format('lll');
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
                            {auth && <button
                                className={`btn btn-primary d-flex align-items-center ${styles.btnAskQuestion}`}
                                onClick={openAskQuestion}
                            >
                                Đặt câu hỏi
                            </button>}
                        </div>
                        <div className="d-flex justify-content-start mb-1 gap-5">
                            <div><span className="text-blur">Thời gian hỏi</span> <span>{convertDateBefore(askedTime)}</span></div>
                            <div><span className="text-blur">Thời gian chỉnh sửa</span> <span>{convertDateBefore(question?.updatedAt)}</span></div>
                            <div><span className="text-blur">Lượt xem</span> <span>{question?.view || 0}</span></div>
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
                            <div className="d-flex justify-content-between mt-5">
                                <span className={styles.edit}>{auth && "Chỉnh sửa"}</span>
                                {question?.updatedAt && <span className={styles.actionTime}>Đã chỉnh sửa {convertDateTime(question.updatedAt)}</span>}
                                <div className={styles.userInfo}>
                                    {question?.createdAt && <span className={styles.actionTime}>Đã hỏi {convertDateTime(question.createdAt)}</span>}
                                    <div className="d-flex">
                                        {question ? <img src="" alt="" width={32} height={32} className={styles.avatar} />
                                        : <Skeleton animation="wave" variant="circular" width={32} height={32} />}
                                        <div className={styles.userDetail}>
                                            {question ? <a href="">{question?.author.username}</a>
                                            : <Skeleton animation="wave" variant="rounded" width={80} height={20} />}
                                            <div className={styles.reputationScore}></div>
                                        </div>
                                    </div>
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
                            {auth && <div className={styles.addComment}>
                                Thêm bình luận
                            </div>}
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
                                        <div className="d-flex justify-content-between mt-5">
                                            <span className={styles.edit}>{auth && "Chỉnh sửa"}</span>
                                            {question?.updatedAt && <span className={styles.actionTime}>Đã chỉnh sửa {convertDateTime(question.updatedAt)}</span>}
                                            <div className={styles.userInfo}>
                                                {question?.createdAt && <span className={styles.actionTime}>Đã hỏi {convertDateTime(question.createdAt)}</span>}
                                                <div className="d-flex">
                                                    {question ? <img src="" alt="" width={32} height={32} className={styles.avatar} />
                                                        : <Skeleton animation="wave" variant="circular" width={32} height={32} />}
                                                    <div className={styles.userDetail}>
                                                        {question ? <a href="">{question?.author.username}</a>
                                                            : <Skeleton animation="wave" variant="rounded" width={80} height={20} />}
                                                        <div className={styles.reputationScore}></div>
                                                    </div>
                                                </div>
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
                                        {auth && <div className={styles.addComment}>
                                            Thêm bình luận
                                        </div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                    {auth && <div className={`${styles.answerSection} ${styles.myAnswer}`} data-color-mode="light">
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
                    </div>}
				</div>
			</div>
		</div>
	);
}

export default QuestionPage;
