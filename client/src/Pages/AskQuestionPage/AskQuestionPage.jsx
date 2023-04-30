import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { postQuestion } from "../../Api/question-api";
import "./AskQuestionPage.scss";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { toast } from "react-toastify";
import { getCourse } from "Api/course";
import { debounce } from "lodash";

function AskQuestionPage() {
    const [content, setContent] = useState("");
    const [course, setCourse] = useState("");

		const [data, setData] = useState({
			title: "",
			content: "",
			course: ""
		});

		const [isOpenListCourse, setIsOpenListCourse] = useState(false);
		const [dataListCourse, setDataListCourse] = useState([
			{id: 121, code: "INT 12312", name: "dad"},
			{id: 121, code: "INT 1233123112", name: "fasdfa"},
			{id: 121, code: "INT 3123", name: "dad"},
			{id: 121, code: "INT 1231231312", name: "dadfasd"},
			{id: 121, code: "INT 1231", name: "daadfadfd"},
			{id: 121, code: "INT 121312", name: "fasdfaafad"},
			{id: 121, code: "INT 1231312312", name: "dad"},
			{id: 121, code: "INT 1241231312", name: "dafafdd"},
		]);

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
				setIsFetchingDataCourse(true);
				debounceSearchCourse(e.target.value);
				if (!isOpenListCourse) {
					setIsOpenListCourse(true);
				}
    }
		
		const debounceSearchCourse = useRef(debounce((nextValue) => fetchDropdownOptions(nextValue), 600)).current;

    function submitQuestion() {
			toast.success('Đặt câu hỏi thành công');
    }

		function handleContent(e) {
			setData({...data, content: e.target.value});
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
			getCourse(1, 6).then(res => {
				if (!res) {
					return;
				}
				setIsFetchingDataCourse(false);
				setDataListCourse(res);
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
							{dataListCourse?.map((item, index) =>
								(<div className="popup-item d-flex flex-column gap-1" key={index} onClick={() => selectCourse(item)}>
									<div className="popup-item-title d-flex"><div className="tag">{item.code}</div></div>
									<div className="popup-item-content">{item.name}</div>
								</div>)
							)}
					</div>)}
				</div>
			</div>
			<Button variant="contained" onClick={submitQuestion} className="ask__submit">Đặt câu hỏi</Button>
		</div>
	);
}

export default AskQuestionPage;
