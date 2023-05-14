import { Button } from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import { suggestCourse } from "Api/course";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "./AskQuestionPage.scss";
import { postQuestion } from "Api/question-api";

function AskQuestionPage() {
    const [content, setContent] = useState("");
    const [course, setCourse] = useState("");

		const [data, setData] = useState({
			title: "",
			content: "",
			course: ""
		});

		const [isOpenListCourse, setIsOpenListCourse] = useState(false);
		const [dataListCourse, setDataListCourse] = useState([]);

		const [isFetchingDataCourse, setIsFetchingDataCourse] = useState(false);

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
			postQuestion(data.title, data.content, data.course).then((res) => {
				if (res) {
					toast.success('Đặt câu hỏi thành công');
					setData({
						title: "",
						content: "",
						course: ""
					})
				} else {
					toast.error('Có lỗi xảy ra');
				}
			})
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
				Ask a public question
			</div>
			<div className="ask-question-page--ask">
				<div className="ask__title">
					Title
					<input
						type="text"
						value={data.title}
						onChange={handleTitle}
						placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
					/>
				</div>
				<div className="ask__body" data-color-mode="light">
					Body
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
			<Button variant="contained" onClick={submitQuestion} className="ask__submit">Đặt câu hỏi</Button>
		</div>
	);
}

export default AskQuestionPage;
