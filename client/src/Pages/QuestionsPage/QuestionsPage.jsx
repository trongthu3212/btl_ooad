import Sidebar from "../../Layouts/Sidebar/Sidebar";
import "./QuestionsPage.scss";

function QuestionsPage() {
    return (
        <div className="questions-page">
            <Sidebar namePage="questions" />
            <h1>Questions Page</h1>
        </div>
    );
}

export default QuestionsPage;
