import { Alert, Pagination, Skeleton, ToggleButton, ToggleButtonGroup, styled } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getPostsPaging } from "../../Api/question-api";
import Sidebar from "../../Layouts/Sidebar/Sidebar";
import styles from "./QuestionsPage.module.scss";
import AuthContext from 'Auth/AuthProvider';
import SearchContext from 'SearchContext/SearchProvider';

const CustomToggleButton = styled(ToggleButton)({
    borderRadius: "4px !important",
    padding: "8px",
    border: "1px solid rgba(0, 0, 0, 0.12) !important",
    "&.Mui-selected": {
        backgroundColor: "#f48225 !important",
        color: "#ffffff",
        borderColor: "#f48225"
    }
});

function QuestionsPage() {
    const navigate = useNavigate();

    const {auth} = useContext(AuthContext);

    const {search} = useContext(SearchContext);

    // dữ liệu câu hỏi
    const [data, setData] = useState([]);

    const [paging, setPaging] = useState({page: 1, pageSize: 15});

    // Cờ check loading
    const [isLoading, setIsLoading] = useState(true);

    // Lọc câu hỏi theo trạng thái
    const [state, setState] = useState("newest");

    const [total, setTotal] = useState(0);

    useEffect(() => {
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

    useEffect(() => {
        setIsLoading(true);
        getPostsPaging(paging.page, paging.pageSize, state, search).then(res => {
            setData(res.posts);
            setTotal(res.globalPostCount);
            setIsLoading(false);
        })
    }, [paging.page, paging.pageSize, state, search])

    /**
     * Điều hướng sang trang câu hỏi
     */
    function openAskQuestion() {
        navigate("/questions/ask");
    }

    function changePageSize(e, value) {
        setPaging({...paging, pageSize: value})
    }

    /**
     * Thay đổi trạng thái lọc
     */
    function changeFilter(state) {
        setState(state);
    }

    function viewQuestion(id) {
        sessionStorage.setItem(`increaseView${id}`, true);
        navigate(`/question/${id}`);
    }

    return (
		<div className={styles["questions-page"]}>
			<Sidebar />

			<div className={`${styles["main-content"]} flex-fill`}>
                <div className={styles["header-content"]}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="title">Tất cả câu hỏi</h2>
                        {auth && <button
                            className={`btn btn-primary d-flex align-items-center ${styles.btnAskQuestion}`}
                            onClick={openAskQuestion}
                        >
                            Đặt câu hỏi
                        </button>}
                    </div>
    
                    <div className="d-flex justify-content-between">
                        {!isLoading ? <div className={styles.totalQuestion}>{total} câu hỏi</div>
                        : <Skeleton animation="wave" variant="rounded" width={200} height={24} />}
                        <div className={`btn-group ${styles.filter}`}>
                            <input type="radio" className="btn-check" name="btnradio" id="btnradio1"
                                checked={state === "newest"} onChange={() => changeFilter("newest")} />
                            <label className="btn btn-outline-secondary" htmlFor="btnradio1">Mới nhất</label>

                            <input type="radio" className="btn-check" name="btnradio" id="btnradio2"
                                checked={state === "unanswered"} onChange={() => changeFilter("unanswered")}/>
                            <label className="btn btn-outline-secondary" htmlFor="btnradio2">Chưa trả lời</label>
                        </div>
                    </div>
                </div>

				<div className={styles["list-question"]}>
					{isLoading ? (
						[...Array(15)].map((value, index) => (
                            <div className={styles["preview-question"]} key={index}>
                                <div className={styles.titleLoading}>
                                    <Skeleton animation="wave" variant="rounded" width="50%" height={24} />
                                </div>
                                <div className={styles.contentLoading}>
                                    <Skeleton animation="wave" variant="rounded" width="100%" height={20} />
                                    <Skeleton animation="wave" variant="rounded" width="70%" height={20} />
                                </div>
                                <div className={styles.footerLoading}>
                                    <div className={styles.postTag}>
                                        <Skeleton animation="wave" variant="rounded" width={80} height={20} />
                                        <Skeleton animation="wave" variant="rounded" width={80} height={20} />
                                    </div>
                                    <Skeleton animation="wave" variant="rounded" width={300} height={20} />
                                </div>
                            </div>
                        ))
					) : (
						data.map((obj) => {
							return (
								<div
									className={styles["preview-question"]}
									key={obj.id}
								>
									<div>
										<span onClick={() => viewQuestion(obj.id)} className={styles.title}>{obj.title}</span>
									</div>
									<div className={styles.content}>
										{obj.shortDescription}
									</div>
                                    <div className={styles.footer}>
                                        {obj.course ? <div className={styles.postTag}>
                                            <div className={styles.tag}>{obj.course.code}</div>
                                            <div className={styles.tag}>{obj.course.name}</div>
                                        </div> : <div></div>}
                                        <div className={styles.user}>
                                            <a href="#">{obj.author.username}</a> đã hỏi
                                        </div>
                                    </div>
								</div>
							);
						})
					)}
				</div>

                <div className={styles.pagination}>
                    <Pagination count={total % paging.pageSize === 0 ? total / paging.pageSize : parseInt(total / paging.pageSize) + 1}
                        variant="outlined" shape="rounded"
                        sx={{
                            '& .Mui-selected': {
                              backgroundColor: "#f48225 !important",
                              color: "#ffffff",
                              borderColor: "#f48225"
                            },
                          }}
                    />
                    <div className="d-flex align-items-center gap-2">
                        <ToggleButtonGroup
                            value={paging.pageSize}
                            exclusive
                            onChange={(e, value) => changePageSize(e, value)}
                            sx={{
                                height: "32px"
                            }}
                        >
                            <CustomToggleButton value={15}>
                                15
                            </CustomToggleButton>
                            <CustomToggleButton value={30} sx={{
                                    margin: "0 8px !important",
                                }}
                            >
                                30
                            </CustomToggleButton>
                            <CustomToggleButton value={50}>
                                50
                            </CustomToggleButton>
                        </ToggleButtonGroup>
                        <span>trên trang</span>
                    </div>
                </div>
			</div>
		</div>
	);
}

export default QuestionsPage;
