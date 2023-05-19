import Sidebar from "../../Layouts/Sidebar/Sidebar";
import styles from "./QuestionPage.module.scss";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { useState, useEffect, useContext } from "react";
import { changeVoteQuestion, getComment, getPost, increasePostView } from "../../Api/question-api";
import { Skeleton } from "@mui/material";
import moment from "moment/moment";
import 'moment/locale/vi'
import AuthContext from "Auth/AuthProvider";
import { acceptAnswerById, addAnswer, changeVoteAnswer, unacceptAnswerById } from "Api/answer";
import { toast } from "react-toastify";
import { addComment } from "Api/comment";
import DefaultAvatar from "Assets/DefaultAvatar.jfif"

function QuestionPage() {
    let { idQuestion } = useParams();
    const {auth} = useContext(AuthContext);

    const navigate = useNavigate();

    const [question, setQuestion] = useState();

    const [answers, setAnswers] = useState([]);

    const [myAnswer, setMyAnswer] = useState("");

    const [openAddComment, setOpenAddComment] = useState(false);

    useEffect(() => {
        let isIncreaseView = sessionStorage.getItem(`increaseView${idQuestion}`);
        getPost(idQuestion).then((res) => {
            if (res) {
                if (isIncreaseView) {
                    setQuestion({...res, myComment: "", isShowCommentInput: false, view: res.view + 1});
                    increasePostView(idQuestion);
                    sessionStorage.removeItem(`increaseView${idQuestion}`);
                } else {
                    setQuestion({...res, myComment: "", isShowCommentInput: false });
                }
                if (res.answers) {
                    const tmp = res.answers.map((answer) => {
                        return {...answer, myComment: "", isShowCommentInput: false};
                    })
                    setAnswers(tmp);
                }
            }
            
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
        addAnswer(idQuestion, myAnswer).then((res) => {
            if (res) {
                let tmp = {...res, comments: [], score: 0};
                setAnswers([...answers, tmp]);
                setMyAnswer("");
                toast.success('Thêm câu trả lời thành công');
            } else {
                toast.error('Có lỗi xảy ra');
            }
        })
    }
    
    function acceptAnswer(id) {
        if (answers.find((answer) => answer.id == id).accepted) {
            unacceptAnswerById(id).then((res) => {
                if (res) {
                    const tmp = answers.map((answer) => {
                        return {...answer, accepted: false};
                    })
                    setAnswers(tmp);
                    toast.info("Đã huỷ chấp nhận câu trả lời");
                } else {
                    toast.error('Có lỗi xảy ra');
                }
            })
        } else {
            acceptAnswerById(id).then((res) => {
                if (res) {
                    const tmp = answers.map((answer) => {
                        if (answer.id == id) {
                            return {...answer, accepted: true};
                        }
                        return {...answer, accepted: false};
                    })
                    setAnswers(tmp);
                    toast.success("Đã đánh dấu là câu trả lời tốt nhất");
                } else {
                    toast.error('Có lỗi xảy ra');
                }
            })
        }
    }

    function handleAddComment(type, id) {
        // comment câu hỏi, còn lại là câu trả lời

        if (type == 1) {
            addComment(id, question.myComment, type).then((res) => {
                if (res) {
                    toast.success("Thêm bình luận thành công");
                    let tmp = [...question.comments];
                    tmp.push(res);
                    setQuestion({...question, isShowCommentInput: false, myComment: "", comments: tmp});
                } else {
                    toast.error("Có lỗi xảy ra");
                }
            })
        } else {
            let comment = answers.find((answer) => answer.id == id).myComment;
            addComment(id, comment, type).then((res) => {
                if (res) {
                    toast.success("Thêm bình luận thành công");
                    const temp = answers.map((answer) => {
                        answer.myComment = "";
                        if (answer.id === id) {
                            answer.comments.push(res);
                            return {...answer, isShowCommentInput: false};
                        }
                        return answer;
                    })
                    setAnswers(temp);
                } else {
                    toast.error("Có lỗi xảy ra");
                }
            })
        }
    }

    function openCommentAnswer(id, isOpen) {
        const temp = answers.map((answer) => {
            if (answer.id === id) {
                return {...answer, isShowCommentInput: isOpen};
            }
            return answer;
        })
        setAnswers(temp);
    }

    function handleComment(id, comment) {
        const temp = answers.map((answer) => {
            if (answer.id === id) {
                return {...answer, myComment: comment};
            }
            return answer;
        })
        setAnswers(temp);
    }

    function voteQuestion(type) {
        if (!auth) {
            toast.info("Bạn cần phải đăng nhập để thực hiện chức năng này");
            return;
        }
        if (type == 1) {
            if (question.voted == 1) {
                changeVoteQuestion(idQuestion, "zerovote").then((res) => {
                    if (!res) {
                        toast.error("Có lỗi xảy ra");
                        return;
                    }
                    const tmp = question.score - 1;
                    setQuestion({...question, score: tmp, voted: 0});
                    toast.success("Huỷ đánh giá thành công")
                })
                return;
            }
            changeVoteQuestion(idQuestion, "upvote").then((res) => {
                if (!res) {
                    toast.error("Có lỗi xảy ra");
                    return;
                }
                const tmp = question.voted == -1 ? question.score + 2 : question.score + 1;
                setQuestion({...question, score: tmp, voted: 1});
                toast.success("Đánh giá thành công")
            })
        } else {
            if (question.voted == -1) {
                changeVoteQuestion(idQuestion, "zerovote").then((res) => {
                    if (!res) {
                        toast.error("Có lỗi xảy ra");
                        return;
                    }
                    const tmp = question.score + 1;
                    setQuestion({...question, score: tmp, voted: 0});
                    toast.success("Huỷ đánh giá thành công")
                })
                return;
            }
            changeVoteQuestion(idQuestion, "downvote").then((res) => {
                if (!res) {
                    toast.error("Có lỗi xảy ra");
                    return;
                }
                const tmp = question.voted == 1 ? question.score - 2 : question.score - 1;
                setQuestion({...question, score: tmp, voted: -1})
                toast.success("Đánh giá thành công")
            })
        }
    }

    function voteAnswer(type, id) {
        const answerSelected = answers.find((answer) => answer.id == id);
        if (!auth) {
            toast.info("Bạn cần phải đăng nhập để thực hiện chức năng này");
            return;
        }
        if (type == 1) {
            if (answerSelected.voted == 1) {
                changeVoteAnswer(id, "zerovote").then((res) => {
                    if (!res) {
                        toast.error("Có lỗi xảy ra");
                        return;
                    }
                    const tmp = answers.map((answer) => {
                        if (answer.id === id) {
                            return {...answer, score: answerSelected.score - 1, voted: 0};
                        }
                        return answer;
                    });
                    setAnswers(tmp);
                    toast.success("Huỷ đánh giá thành công")
                })
                return;
            }
            changeVoteAnswer(id, "upvote").then((res) => {
                if (!res) {
                    toast.error("Có lỗi xảy ra");
                    return;
                }
                const tmp = answers.map((answer) => {
                    if (answer.id === id) {
                        return {...answer, score: answerSelected.voted == -1 ? answerSelected.score + 2 : answerSelected.score + 1, voted: 1};
                    }
                    return answer;
                });
                setAnswers(tmp);
                toast.success("Đánh giá thành công")
            })
        } else {
            if (answerSelected.voted == -1) {
                changeVoteAnswer(id, "zerovote").then((res) => {
                    if (!res) {
                        toast.error("Có lỗi xảy ra");
                        return;
                    }
                    const tmp = answers.map((answer) => {
                        if (answer.id === id) {
                            return {...answer, score: answerSelected.score + 1, voted: 0};
                        }
                        return answer;
                    });
                    setAnswers(tmp);
                    toast.success("Huỷ đánh giá thành công")
                })
                return;
            }
            changeVoteAnswer(id, "downvote").then((res) => {
                if (!res) {
                    toast.error("Có lỗi xảy ra");
                    return;
                }
                const tmp = answers.map((answer) => {
                    if (answer.id === id) {
                        return {...answer, score: answerSelected.voted == 1 ? answerSelected.score - 2 : answerSelected.score - 1, voted: -1};
                    }
                    return answer;
                });
                setAnswers(tmp);
                toast.success("Đánh giá thành công")
            })
        }
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
                            <div><span className="text-blur">Thời gian hỏi</span> <span>{convertDateBefore(question?.createdAt)}</span></div>
                            <div><span className="text-blur">Thời gian chỉnh sửa</span> <span>{convertDateBefore(question?.updatedAt)}</span></div>
                            <div><span className="text-blur">Lượt xem</span> <span>{question?.view}</span></div>
                        </div>
                        <div></div>
                    </div>
                    <div className={styles["question-content"]}>
                        <div className={styles.voteSection}>
                            <button className={`${styles.btnVote} ${question && question.voted == 1 && styles.voteActive}`} onClick={() => voteQuestion(1)}>
                                <svg aria-hidden="true" className="svg-icon iconArrowUpLg" width="36" height="36" viewBox="0 0 36 36"><path d="M2 25h32L18 9 2 25Z"></path></svg>
                            </button>
                            <div className={styles.voteCount}>{question?.score}</div>
                            <button className={`${styles.btnVote} ${question && question.voted == -1 && styles.voteActive}`} onClick={() => voteQuestion(2)}>
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
                                <span className={styles.edit} onClick={() => navigate(`/question/edit/${idQuestion}`)}>{auth && "Chỉnh sửa"}</span>
                                {question ? <span className={styles.actionTime}>Đã chỉnh sửa {convertDateTime(question.updatedAt)}</span>
                                    : <Skeleton animation="wave" variant="rounded" width={80} height={18} />}
                                <div className={styles.userInfo}>
                                    {question ? <span className={styles.actionTime}>Đã hỏi {convertDateTime(question.createdAt)}</span>
                                        : <Skeleton animation="wave" variant="rounded" width={80} height={18} />}
                                    <div className="d-flex">
                                        {question ? <img src={question?.author?.avatar ?? DefaultAvatar} alt="" width={32} height={32} className={styles.avatar} />
                                        : <Skeleton animation="wave" variant="circular" width={32} height={32} />}
                                        <div className={styles.userDetail}>
                                            {question ? <a href="">{question?.author.username}</a>
                                            : <Skeleton animation="wave" variant="rounded" width={80} height={18} />}
                                            <div className={styles.reputationScore}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.commentSection}>
                                {question?.comments ? (
                                    (question.comments.map((obj, idx) => (
                                        <div key={idx} className={styles.comment}>
                                            <span>{obj.content}</span> - <a href="#">{obj.author?.username}</a> <span className={styles.relativeTime}>{convertDateTime(obj.updatedAt)}</span>
                                        </div>
                                    )))
                                    ) : 
                                    <Skeleton animation="wave" variant="rounded" width="100%" />}
                            </div>
                            {auth && !question?.isShowCommentInput && <div>
                                <span className={styles.addComment} 
                                    onClick={() => setQuestion({...question, isShowCommentInput: true})}>
                                    Thêm bình luận
                                </span>
                            </div>}
                            {question?.isShowCommentInput && <div className={styles.commentInput}>
                                <textarea  className="form-control" rows="3" value={question.myComment} 
                                    onChange={(e) => setQuestion({...question, myComment: e.target.value})}></textarea>
                                <div className="d-flex justify-content-end mt-3">
                                    <button type="button" className="btn btn-outline-secondary me-4" 
                                        onClick={() => setQuestion({...question, isShowCommentInput: false})}>Huỷ</button>
                                    <button type="button" className="btn btn-primary" 
                                        onClick={() => handleAddComment(1, idQuestion)} disabled={!question.myComment}>Thêm</button>
                                </div>
                            </div>}
                        </div>
                    </div>
                    {answers && answers.length > 0 &&
                        <div className={styles.answerSection}>
                            <h2 className={styles.countAnswer}>
                                {answers.length} câu trả lời
                            </h2>
                            {answers.map((answer, idx) => (
                                <div className={styles["question-content"]} key={idx}>
                                    <div className={styles.voteSection}>
                                        <button className={`${styles.btnVote} ${answer.voted == 1 && styles.voteActive}`} onClick={() => voteAnswer(1, answer.id)}>
                                            <svg aria-hidden="true" className="svg-icon iconArrowUpLg" width="36" height="36" viewBox="0 0 36 36"><path d="M2 25h32L18 9 2 25Z"></path></svg>
                                        </button>
                                        <div className={styles.voteCount}>{answer.score}</div>
                                        <button className={`${styles.btnVote} ${answer.voted == -1 && styles.voteActive}`} onClick={() => voteAnswer(2, answer.id)}>
                                            <svg aria-hidden="true" className="svg-icon iconArrowDownLg" width="36" height="36" viewBox="0 0 36 36"><path d="M2 11h32L18 27 2 11Z"></path></svg>
                                        </button>
                                        {answer?.accepted && <button className={`${styles.btnVote} ${styles.markBestAnswer}`} onClick={() => acceptAnswer(answer.id)}>
                                            <svg aria-hidden="true" className="svg-icon iconCheckmarkLg" width="36" height="36" viewBox="0 0 36 36"><path d="m6 14 8 8L30 6v8L14 30l-8-8v-8Z"></path></svg>
                                        </button>}
                                        {auth && question?.author.id == auth.id && !answer?.accepted && <button className={styles.btnVote} onClick={() => acceptAnswer(answer.id)}>
                                            <svg aria-hidden="true" className="svg-icon iconCheckmarkLg" width="36" height="36" viewBox="0 0 36 36"><path d="m6 14 8 8L30 6v8L14 30l-8-8v-8Z"></path></svg>
                                        </button>}
                                    </div>
                                    <div className={`${styles.questionDetail} flex-grow-1`}>
                                        <div className={styles.content}>
                                            {answer.content}
                                        </div>
                                        <div className="d-flex justify-content-between mt-5">
                                            <span className={styles.edit}>{auth && "Chỉnh sửa"}</span>
                                            {answer ? <span className={styles.actionTime}>Đã chỉnh sửa {convertDateTime(answer.updatedAt)}</span>
                                                : <Skeleton animation="wave" variant="rounded" width={150} height={18} />}
                                            <div className={styles.userInfo}>
                                                {answer ? <span className={styles.actionTime}>Đã trả lời {convertDateTime(answer.createdAt)}</span>
                                                    : <Skeleton animation="wave" variant="rounded" width={150} height={18} />}
                                                <div className="d-flex">
                                                    {answer ? <img src={question?.author?.avatar ?? DefaultAvatar} alt="" width={32} height={32} className={styles.avatar} />
                                                        : <Skeleton animation="wave" variant="circular" width={32} height={32} />}
                                                    <div className={styles.userDetail}>
                                                        {answer ? <a href="">{answer?.author?.username}</a>
                                                            : <Skeleton animation="wave" variant="rounded" width={80} height={18} />}
                                                        <div className={styles.reputationScore}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.commentSection}>
                                            {answer?.comments ? (
                                                (answer.comments.map((obj, idx) => (
                                                    <div key={idx} className={styles.comment}>
                                                        <span>{obj.content}</span> - <a href="#">{obj.author?.username}</a> <span className={styles.relativeTime}>{convertDateTime(obj.updatedAt)}</span>
                                                    </div>
                                                )))
                                            ) :
                                                <Skeleton animation="wave" variant="rounded" width="100%" />}
                                        </div>
                                        {auth && !answer?.isShowCommentInput && <div>
                                            <span className={styles.addComment} 
                                                onClick={() => openCommentAnswer(answer.id, true)}>
                                                Thêm bình luận
                                            </span>
                                        </div>}
                                        {answer?.isShowCommentInput && <div className={styles.commentInput}>
                                            <textarea  className="form-control" rows="3" value={answer.myComment} 
                                                onChange={(e) => handleComment(answer.id, e.target.value)}></textarea>
                                            <div className="d-flex justify-content-end mt-3">
                                                <button type="button" className="btn btn-outline-secondary me-4" 
                                                    onClick={() => openCommentAnswer(answer.id, false)}>Huỷ</button>
                                                <button type="button" className="btn btn-primary" 
                                                    onClick={() => handleAddComment(2, answer.id)} disabled={!answer.myComment}>Thêm</button>
                                            </div>
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
                        <button disabled={!myAnswer}
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
