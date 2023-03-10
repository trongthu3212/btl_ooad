import React, { useState } from "react";
import { Pages } from "./AdminPage.jsx";
import { postQuestion, deletePost, updatePost } from "../../Api/question-api";
import { DataGrid } from '@mui/x-data-grid';

// data props have at least one record to use following component
function AdminPageContent({ data, pageName, loading }) {
    const [currentFormData, setCurrentFormData] = useState({});
    const [isFormEnable, setIsFormEnable] = useState(false);


    function handleSubmit(e) {
        e.preventDefault();
        if (pageName === Pages.POST) {
            updatePost(currentFormData).then((res) => {});
        }
    }


    function handleFormEnable(e, obj) {
        let recordData = obj.row;   
        if (!recordData?._id) {
            let recordDataEmpty = { ...data[0] };
            Object.keys(recordDataEmpty).forEach((key) => (recordDataEmpty[key] = ""));
            setCurrentFormData(recordDataEmpty);
        } else {
            setCurrentFormData(recordData);
        }
        setIsFormEnable(true);
    }

    function handleDeleteForm(e, obj) {
        deletePost(obj.id).then((res) => {});
    }

    function handleChangeForm(e, key) {
        setCurrentFormData({ ...currentFormData, [key]: e.target.value });
    }

    /**
     * Cấu hình cột cho grid
     */
    const columns =
		pageName === Pages.USER
			? [
					{ field: "_id", headerName: "ID", width: 250 },
					{ field: "username", headerName: "Username", width: 150 },
					{ field: "email", headerName: "Email", width: 150 },
					{ field: "role", headerName: "Role", width: 150 },
					{ field: "createdAt", headerName: "CreatedDate", width: 200 },
					{ field: "updatedAt", headerName: "ModifiedDate", width: 200 },
					{
						field: "actions",
						type: "actions",
						getActions: (params) => [
							<button
								onClick={(e) => {
									handleFormEnable(e, params);
								}}
							>
								Edit
							</button>,
							<button
								onClick={(e) => {
									handleDeleteForm(e, params);
								}}
							>
								Delete
							</button>,
						],
					},
			  ]
			: [
					{ field: "_id", headerName: "ID", width: 250 },
					{ field: "title", headerName: "Title", width: 150 },
					{ field: "content", headerName: "Content", width: 150 },
					{ field: "shortDescription", headerName: "ShortDescription", width: 150 },
					{ field: "author", headerName: "Author", width: 150 },
					{ field: "createdAt", headerName: "CreatedDate", width: 200 },
					{ field: "updatedAt", headerName: "ModifiedDate", width: 200 },
					{
						field: "actions",
						type: "actions",
						getActions: (params) => [
							<button
								onClick={(e) => {
									handleFormEnable(e, params);
								}}
							>
								Edit
							</button>,
							<button
								onClick={(e) => {
									handleDeleteForm(e, params);
								}}
							>
								Delete
							</button>,
						],
					},
			  ];

    return (
        <div className="admin__main">
            <div className="main__header">
                <h1>{pageName}</h1>
                <button onClick={(e) => handleFormEnable(e, {})}>+ New {pageName}</button>
            </div>
            <div className="main__list">
                <DataGrid columns={columns} rows={data} getRowId={(row) => row._id}
                    disableColumnFilter={true} loading={loading} />
            </div>

            {isFormEnable && (
                <div className="main__form">
                    <div className="form__close" onClick={() => setIsFormEnable(false)}>
                        X
                    </div>
                    <form onSubmit={handleSubmit}>
                        {Object.keys(currentFormData).map((key, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <div className="form__title">{key}</div>
                                    <input
                                        type="text"
                                        value={currentFormData[key]}
                                        onChange={(e) => {
                                            handleChangeForm(e, key);
                                        }}
                                    />
                                </React.Fragment>
                            );
                        })}
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            )}
        </div>
    );
}

export default AdminPageContent;
