import { Pagination, Skeleton, ToggleButton, ToggleButtonGroup, styled } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPostsPaging } from "../../Api/question-api";
import Sidebar from "../../Layouts/Sidebar/Sidebar";
import styles from "./QuestionsPage.module.scss";

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

    // dữ liệu câu hỏi
    const [data, setData] = useState([]);

    const [paging, setPaging] = useState({page: 1, pageSize: 15});

    // Cờ check loading
    const [isLoading, setIsLoading] = useState(true);

    // Lọc câu hỏi theo trạng thái
    const [state, setState] = useState("newest");

    const [total, setTotal] = useState(0);

    useEffect(() => {
        // Lấy dữ liệu câu hỏi
        getPostsPaging(paging.page, paging.pageSize).then(res => {
            setData(res.posts);
            setTotal(res.globalPostCount);
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

    useEffect(() => {
        setIsLoading(true);
        getPostsPaging(paging.page, paging.pageSize).then(res => {
            setData(res.posts);
            setTotal(res.globalPostCount);
            setIsLoading(false);
        })
    }, [paging])

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

    function changePageSize(e, value) {
        setPaging({...paging, pageSize: value})
    }

    /**
     * Thay đổi trạng thái lọc
     */
    function changeFilter(state) {
        setState(state);
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
									<Link to={obj.id} className={styles.title}>
										{obj.title}
									</Link>
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
                            onChange={changePageSize}
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
