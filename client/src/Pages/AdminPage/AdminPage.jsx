import { useState, useEffect } from "react";
import AdminPageContent from "./AdminPageContent.jsx";
import { getAllUsers } from "../../Api/user-api";
import { getAllPosts } from "../../Api/question-api";
import "./AdminPage.scss";

export const Pages = {
    USER: "User",
    POST: "Post",
}

function AdminPage() {
	const [data, setData] = useState([]);
	const [pageName, setPageName] = useState(Pages.USER);
    
	// Cờ check loading
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		getAllUsers().then((res) => {
			setData(res);
            setIsLoading(false);
		});
	}, []);

	function handleSideUser() {
        setData([]);
        setIsLoading(false);
        setPageName(Pages.USER);
		getAllUsers().then((res) => {
			setData(res);
            setIsLoading(false);
		});
	}

	function handleSidePost() {
        setData([]);
        setIsLoading(false);
        setPageName(Pages.POST);
		getAllPosts().then((res) => {
			setData(res);
            setIsLoading(false);
		});
	}

	return (
		<div className="admin-page">
			<div className="admin__sidebar">
				<div className="sidebar-nav">
					<h4>ADMIN</h4>
					<li
						onClick={handleSideUser}
						className={
							pageName === Pages.USER ? "target-active" : ""
						}
					>
						{Pages.USER}
					</li>
					<li
						onClick={handleSidePost}
						className={
							pageName === Pages.POST ? "target-active" : ""
						}
					>
						{Pages.POST}
					</li>
				</div>
			</div>

			{data.length && (
				<AdminPageContent data={data} pageName={pageName} loading={isLoading} />
			)}
		</div>
	);
}

export default AdminPage;
