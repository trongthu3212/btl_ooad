import "./Header.scss";

function Header() {
    return (
        <div className="header">
            <div className="header__logo"></div>
            <div className="header__about">About</div>
            <div className="header__search">
                <svg fill="#525960" width="18" height="18">
                    <path d="m18 16.5-5.14-5.18h-.35a7 7 0 1 0-1.19 1.19v.35L16.5 18l1.5-1.5ZM12 7A5 5 0 1 1 2 7a5 5 0 0 1 10 0Z" />
                </svg>
                <input type="text" name="search" placeholder="Search..." />
            </div>
            <div className="header__login">Log in</div>
            <div className="header__signup">Sign up</div>
        </div>
    );
}

export default Header;
