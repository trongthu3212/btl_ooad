import { useState, useEffect } from "react";
import AdminPageContent from "./AdminPageContent.tsx";
import "./AdminPage.scss";

enum Pages {
    USER = "User",
    POST = "Post",
}

function AdminPage() {
    const [data, setData] = useState<Array<any>>([]);
    const [pageName, setPageName] = useState(Pages.USER);

    useEffect(() => {
        setData([
            { id: 1, username: "minhvu", password: 1, role: "admin" },
            { id: 2, username: "vuminh", password: 2, role: "user" },
        ]);
    }, []);

    function handleSideUser() {
        setData([
            { id: 1, username: "minhvu", password: 1, role: "admin" },
            { id: 2, username: "vuminh", password: 2, role: "user" },
        ]);
        setPageName(Pages.USER);
    }

    function handleSidePost() {
        setData([
            { id: 1, title: "fun", content: "something fun", type: "sleep" },
            { id: 2, title: "sad", content: "something sad", type: "javascript" },
        ]);
        setPageName(Pages.POST);
    }

    return (
        <div className="admin-page">
            <div className="admin__sidebar">
                <div className="sidebar-nav">
                    <h4>ADMIN</h4>
                    <a
                        href="#"
                        onClick={handleSideUser}
                        className={pageName === Pages.USER ? "target-active" : ""}>
                        {Pages.USER}
                    </a>
                    <a
                        href="#"
                        onClick={handleSidePost}
                        className={pageName === Pages.POST ? "target-active" : ""}>
                        {Pages.POST}
                    </a>
                </div>
            </div>

            {data.length && <AdminPageContent data={data} pageName={pageName} />}
        </div>
    );
}

export default AdminPage;
