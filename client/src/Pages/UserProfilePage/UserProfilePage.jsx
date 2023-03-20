import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../Auth/AuthProvider";
import Sidebar from "../../Layouts/Sidebar/Sidebar";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getUser, updateProfile } from "../../Api/user-api";
import { ErrorCodes } from "Api/errors";

import "./UserProfilePage.scss";
import DefaultAvatar from "Assets/DefaultAvatar.jfif"

const MaxAvatarFileSize = 5 * 1024 * 1024;

function UserProfilePage() {
    const { idUser } = useParams();
    const { auth } = useContext(AuthContext);
    const [user, setUser] = useState({});
    const [userAvatar, setUserAvatar] = useState("");
    const [userAvatarPreview, setUserAvatarPreview] = useState();
    const [userName, setUserName] = useState("");
    const [userAbout, setUserAbout] = useState("");
    const [viewEdit, setViewEdit] = useState(false);

    useEffect(() => {
        updateUserInfo();
    });

    useEffect(() => {
        if (!userAvatar) {
            setUserAvatarPreview(null);
            return;
        }

        const avatarUrl = URL.createObjectURL(userAvatar)
        setUserAvatarPreview(avatarUrl)

        return () => URL.revokeObjectURL(avatarUrl)
    }, [userAvatar])
    
    useEffect(() => {
        if (!viewEdit) {
            setUserAvatarPreview(null);
            return;
        }
    }, [viewEdit]);

    function updateUserInfo() {
        getUser(idUser).then((res) => {
            setUserName(res.userName);
            setUserAbout(res.about);

            setUser(res);
        });
    }

    function handleUserAvatarFileChange(file) {
        if (file && file.size > MaxAvatarFileSize) {
            alert(`Dung lượng tệp tin avatar phải nhỏ hơn ${MaxAvatarFileSize / 1024 / 1024}MB!`)
        } else {
            setUserAvatar(file);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const profileUploaded = {
            userAvatar: userAvatar,
            userName: userName,
            userAbout: userAbout ?? '',
        };

        await updateProfile(profileUploaded)
            .then(_ => {
                updateUserInfo();
            })
            .catch(err => {
                if (err.response) {
                    let errorCode = err.response.data.error;
                    switch (errorCode) {
                        case ErrorCodes.FileCorrupted:
                            alert("Tệp avatar tải lên không phải là ảnh hoặc đã bị hỏng1");
                            break;

                        case ErrorCodes.FileDimensionTooBig: {
                            const [maxSizeX, maxSizeY] = err.response.data.maximumDimension;
                            alert(`Tệp tải lên có chiều dài hoặc rộng vượt quá cho phép (${maxSizeX}x${maxSizeY})!`);
                            break;
                        }

                        case ErrorCodes.FileTooBig: {
                            alert("Tệp avatar cần tải lên có kích thước quá to!");
                            break;
                        }

                        default:
                            alert(err.response.data.message);
                            break;
                    }
                } else {
                    alert("Sửa đổi đã được ghi nhận!");
                }
            });
    }

    return (
        <div className="user-profile-page">
            <Sidebar />
            <div className="user-profile">
                <div className="profile__header">
                    <img src={(viewEdit && userAvatarPreview) ? userAvatarPreview : (user.avatar ?? DefaultAvatar)}></img>
                    <h1 className="username-label">{user?.userName}</h1>
                    {idUser === auth.id && (
                        <div
                            className="edit-profile-btn"
                            onClick={() => {
                                setViewEdit(!viewEdit);
                            }}>
                            {viewEdit ? "Back" : "Edit profile"}
                        </div>
                    )}
                </div>

                {viewEdit ? (
                    <div className="profile__edit">
                        <form onSubmit={handleSubmit}>
                            <input
                                type="file"
                                onChange={(e) => handleUserAvatarFileChange(e.target.files[0])}></input>
                            <span>Name</span>{" "}
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}></input>
                            <span>About</span>{" "}
                            <textarea
                                value={userAbout}
                                onChange={(e) => setUserAbout(e.target.value)}
                            />
                            <input type="submit" value="Submit" />
                        </form>
                    </div>
                ) : (
                    <div className="profile__content">
                        <div className="content__reputation">
                            Reputation <span>{user?.reputation ?? 0}</span>
                        </div>
                        <div className="content__about">
                            About
                            <span>{(user?.about && user?.about.length !== 0) ? user?.about : "Người dùng này chưa điền thông tin về mình."}</span>
                        </div>
                        <div className="content__recent-question">
                            Recent Questions
                            <Link to="/questions" className="question">
                                title1
                            </Link>
                            <Link to="/questions" className="question">
                                title2
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserProfilePage;
