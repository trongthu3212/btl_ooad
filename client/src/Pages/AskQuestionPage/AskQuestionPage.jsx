import { Button } from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import { suggestCourse } from "Api/course";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "./AskQuestionPage.scss";
import { getPost, postQuestion, updatePost } from "Api/question-api";
import { useNavigate, useParams } from "react-router-dom";

function AskQuestionPage() {
    const [course, setCourse] = useState("");
		const navigate = useNavigate();
		const {idQuestion} = useParams();

		const [data, setData] = useState({
			title: "",
			content: "",
			course: ""
		});

		const [isOpenListCourse, setIsOpenListCourse] = useState(false);
		const [dataListCourse, setDataListCourse] = useState([]);

		const [isFetchingDataCourse, setIsFetchingDataCourse] = useState(false);

		useEffect(() => {
			if (idQuestion) {
				getPost(idQuestion).then((res) => {
					if (res) {
						setData({title: res.title, content: res.content, course: res.course._id});
						setCourse(`${res.course.code} - ${res.course.name}`);
					}
					
			});
			};
		}, []);

		const dropdownRef = useRef(null);
  	useOutsideAlerter(dropdownRef);

		function useOutsideAlerter(ref) {
			useEffect(() => {
				/**
				 * Alert if clicked on outside of element
				 */
				function handleClickOutside(event) {
					if (ref.current && !ref.current.contains(event.target)) {
						setIsOpenListCourse(false);
					}
				}
				// Bind the event listener
				document.addEventListener("mousedown", handleClickOutside);
				return () => {
					// Unbind the event listener on clean up
					document.removeEventListener("mousedown", handleClickOutside);
				};
			}, [ref]);
		}

    function handleTitle(e) {
        setData({...data, title: e.target.value});
    }

		/**
		 * Xử lý tìm kiếm course
		 * @param {*} e 
		 */
    function handleCourse(e) {
        setCourse(e.target.value);
				debounceSearchCourse(e.target.value);
    }
		
		const debounceSearchCourse = useCallback(debounce((nextValue) => fetchDropdownOptions(nextValue), 1000), []);

    function submitQuestion() {
			if (idQuestion) {
				const post = {...data, _id: idQuestion};
				updatePost(post).then((res) => {
					if (res) {
						toast.success('Sửa câu hỏi thành công');
						navigate(`/question/${idQuestion}`);
					} else {
						toast.error('Có lỗi xảy ra');
					}
				})
			} else {
				postQuestion(data.title, data.content, data.course).then((res) => {
					if (res) {
						toast.success('Đặt câu hỏi thành công');
						navigate("/questions");
					} else {
						toast.error('Có lỗi xảy ra');
					}
				})
			}
    }

		function handleContent(e) {
			setData({...data, content: e});
		}

		/**
		 * Xử lý đưa lên input khi chọn khoá học
		 */
		function selectCourse(course) {
			setCourse(`${course.code} - ${course.name}`);
			setIsOpenListCourse(false);
			setData({...data, course: course.id});
		}

		function fetchDropdownOptions(key) {
			if (!key) {
				setIsOpenListCourse(false);
				return;
			}
			setIsFetchingDataCourse(true);
			suggestCourse(key, 6).then(res => {
				if (res) {
					setIsFetchingDataCourse(false);
					setDataListCourse(res.courses);
					if (!isOpenListCourse) {
						setIsOpenListCourse(true);
					}
				}
			});
		}

    return (
		<div className="ask-question-page">
			<div className="ask-question-page__header">
				{!idQuestion ? "Đặt câu hỏi công khai" : "Chỉnh sửa câu hỏi"}
			</div>
			<div className="ask-question-page--ask">
				<div className="ask__title">
					Tiêu đề
					<input
						type="text"
						value={data.title}
						onChange={handleTitle}
						placeholder="VD: Cách tìm một phần tử trong mảng?"
					/>
				</div>
				<div className="ask__body" data-color-mode="light">
					Nội dung
					<MDEditor
						value={data.content}
						onChange={handleContent}
						height="430"
					/>
				</div>
				<div className="ask__tags">
					Khoá học
					<input
						type="text"
						value={course}
						onChange={handleCourse}
						placeholder="e.g. (c laravel php)"
					/>
					{isFetchingDataCourse && <div className="load-combobox">
						<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
					</div>}
					{isOpenListCourse && (<div className="popup d-flex flex-wrap" ref={dropdownRef}>
							{dataListCourse.length > 0 ? dataListCourse.map((item, index) =>
								(<div className="popup-item d-flex flex-column gap-1" key={index} onClick={() => selectCourse(item)}>
									<div className="popup-item-title d-flex"><div className="tag">{item.code}</div></div>
									<div className="popup-item-content">{item.name}</div>
								</div>)
							) : (<span>Không có kết quả</span>)}
					</div>)}
				</div>
			</div>
			<button type="button" className="btn btn-primary mt-4" onClick={() => submitQuestion()} 
				disabled={!data.title || !data.content || !data.course}>{idQuestion ? "Sửa câu hỏi" : "Đặt câu hỏi"}</button>
		</div>
	);
}

export default AskQuestionPage;
