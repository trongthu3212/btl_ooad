import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { postQuestion } from "../../Api/question-api";
import "./AskQuestionPage.scss";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

function AskQuestionPage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    
    // Xác nhận post câu hỏi
    const [openSubmit, setOpenSubmit] = useState(false);

    function handleTitle(e) {
        setTitle(e.target.value);
    }

    function handleTags(e) {
        setTags(e.target.value);
    }

    function submmitQuestion() {
        setOpenSubmit(true);
    }

    /**
     * Xác nhận post question
     */
    function confirmPost() {
        postQuestion(title, content, tags).then((res) => {
            if (res.postId) {

                alert("Success " + res.postId);
                navigate("/questions");
            } else alert("ERROR: " + res);
        });
        closeConfirmSubmit();
    }

    /**
     * Đóng dialog xác nhận submit
     */
    function closeConfirmSubmit() {
        setOpenSubmit(false);
    }

    return (
		<div className="ask-question-page">
			<Dialog open={openSubmit} onClose={closeConfirmSubmit}>
				<DialogContent>
                    Are you sure you want to public your question ?
				</DialogContent>
				<DialogActions>
					<Button onClick={closeConfirmSubmit}>Disagree</Button>
					<Button onClick={confirmPost} autoFocus>
						Agree
					</Button>
				</DialogActions>
			</Dialog>
			<div className="ask-question-page__header">
				Ask a public question
			</div>
			<div className="ask-question-page--ask">
				<div className="ask__title">
					Title
					<input
						type="text"
						value={title}
						onChange={handleTitle}
						placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
					/>
				</div>
				<div className="ask__body" data-color-mode="light">
					Body
					<MDEditor
						value={content}
						onChange={setContent}
						height="430"
					/>
				</div>
				<div className="ask__tags">
					Tags
					<input
						type="text"
						value={tags}
						onChange={handleTags}
						placeholder="e.g. (c laravel php)"
					/>
				</div>
			</div>
			<div className="ask__submmit" onClick={submmitQuestion}>
				Public your question
			</div>
		</div>
	);
}

export default AskQuestionPage;
