import React, { useState } from "react";
import { postQuestion, deletePost, updatePost } from "../../Api/question-api";

// data props have at least one record to use following component
function AdminPageContent({ data, pageName }: { data: Array<any>; pageName: string }) {
    const [currentFormData, setCurrentFormData] = useState({});
    const [isFormEnable, setIsFormEnable] = useState(false);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(currentFormData);
    }

    function handleFormEnable(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, recordData: any) {
        if (!recordData?.id) {
            let recordDataEmpty = { ...data[0] };
            Object.keys(recordDataEmpty).forEach((key) => (recordDataEmpty[key] = ""));
            setCurrentFormData(recordDataEmpty);
        } else {
            setCurrentFormData(recordData);
        }
        setIsFormEnable(true);
    }

    function handleDeleteForm(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) {
        console.log(id);
    }

    function handleChangeForm(e: React.ChangeEvent<HTMLInputElement>, key: string) {
        setCurrentFormData({ ...currentFormData, [key]: e.target.value });
    }

    return (
        <div className="admin__main">
            <div className="main__header">
                <h1>{pageName}</h1>
                <button onClick={(e) => handleFormEnable(e, {})}>+ New {pageName}</button>
            </div>
            <div className="main__list">
                <div className="list__field">
                    {Object.keys(data[0]).map((key, index) => (
                        <span key={index}>{key}</span>
                    ))}
                </div>

                {data.map((obj: any, index: number) => {
                    return (
                        <div key={index} className="list__record">
                            {Object.values(obj).map((value: any, index) => {
                                return <span key={index}>{value}</span>;
                            })}
                            <button
                                onClick={(e) => {
                                    handleFormEnable(e, obj);
                                }}>
                                Edit
                            </button>
                            <button
                                onClick={(e) => {
                                    handleDeleteForm(e, obj.id);
                                }}>
                                Delete
                            </button>
                        </div>
                    );
                })}
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
