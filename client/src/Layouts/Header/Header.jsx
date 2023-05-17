import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import React, { useContext } from "react";
import AuthContext from "../../Auth/AuthProvider";
import HeaderNotification from "../../Components/HeaderNotification/HeaderNotification";
import "./Header.scss";

function Header() {
    let navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    function handleLoginBtn() {
        navigate("/users/login");
    }

    function handleLogoutBtn() {
        if (window.confirm("Are you sure you want to log out ?")) {
            setAuth({});
            Cookies.remove("connect.sid");
            alert("Logout success");
            navigate("/");
        }
    }

    function handleProfileBtn() {
        navigate(`/users/${auth?.id}`);
    }

    return (
        <div className="header">
            <Link to={"/"} className="h-100 d-flex align-items-center justify-content-center">
                <div className="header__logo"></div>
            </Link>

            <div className="header__about d-flex align-items-center">
                <Link to="/questions">Câu hỏi</Link>
            </div>
            <div className="header__search  d-flex align-items-center">
                <svg fill="#525960" width="18" height="18">
                    <path d="m18 16.5-5.14-5.18h-.35a7 7 0 1 0-1.19 1.19v.35L16.5 18l1.5-1.5ZM12 7A5 5 0 1 1 2 7a5 5 0 0 1 10 0Z" />
                </svg>
                <input type="text" name="search" placeholder="Tìm kiếm..." />
            </div>
            {auth?.username ? (
                <React.Fragment>
                    <div className="header__profile" onClick={handleProfileBtn}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png"></img>
                    </div>
                    <HeaderNotification />
                    <div className="header__logout" onClick={handleLogoutBtn}>
                        Đăng xuất
                    </div>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <div className="header__login  d-flex align-items-center" onClick={handleLoginBtn}>
                        Đăng nhập
                    </div>

                    <div className="header__signup  d-flex align-items-center">
                        <a href="/users/signup">Đăng ký</a>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
}

export default Header;
