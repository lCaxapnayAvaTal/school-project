import React, { useEffect, useState } from "react";
import "./Header.scss";
import { Link, useLocation, useNavigate  } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { HiMenu, HiOutlineX } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/theme/themeSlice";
import { signoutSuccess } from "../../redux/user/userSlice";

export const Header = () => {
    const path = useLocation().pathname;
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { currentUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const [searchTerm, setSearchTerm] = useState('');

    const [isShowBurger, setIsShowBurger] = useState(false);
    const [isShowDropdownProfile, setIsShowDropdownProfile] = useState(false);

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }
    },[location.search])

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            });
            const data = await res.json()
            if(!res.ok){
                console.log(data.message);
            }else(
                dispatch(signoutSuccess())
            )
            setIsShowDropdownProfile(false)
        } catch (error) {
            console.log(error.message);
        }
    }

    const ClickHandler = () => {
        if (isShowBurger) {
            setIsShowBurger(false);
        } else {
            setIsShowBurger(true);
        }
    };
    const ShowDropdownProfile = () => {
        if (isShowDropdownProfile) {
            setIsShowDropdownProfile(false);
        } else {
            setIsShowDropdownProfile(true);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };
    const handleSearch = (e) => {
        e.preventDefault()
        navigate(`/search`);
    }
    return (
        <div className="header">
            <div className="header__wrapper">
                <Link to="/" className="header__link">
                    <span className="header__link-span">№ 87</span>
                    Лицей
                </Link>
                <form onSubmit={handleSubmit}>
                    <div className="header__search-wrapper">
                        <input
                            className="header__search"
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e)=>setSearchTerm(e.target.value)}
                        />
                        <span className="header__search-icon">
                            <AiOutlineSearch onClick={handleSubmit}/>
                        </span>
                    </div>
                </form>

                <button onClick={handleSearch} className="header__search-wrapper-t">
                    <div className="header__search-icon-t">
                        <AiOutlineSearch/>
                    </div>
                </button>

                <div
                    className={
                        isShowBurger ? `header__menu active` : `header__menu`
                    }
                >
                    <div className="header__menu-close" onClick={ClickHandler}>
                        <HiOutlineX />
                    </div>
                    <ul>
                        <li>
                            <div
                                className={
                                    path == "/"
                                        ? "header__menu-item active"
                                        : "header__menu-item"
                                }
                            >
                                <Link to="/">Домой</Link>
                            </div>
                        </li>
                        <li>
                            <div
                                className={
                                    path == "/about"
                                        ? "header__menu-item active"
                                        : "header__menu-item"
                                }
                            >
                                <Link to="/about">О нас</Link>
                            </div>
                        </li>
                        <li>
                            <div
                                className={
                                    path == "/projects"
                                        ? "header__menu-item active"
                                        : "header__menu-item"
                                }
                            >
                                <Link to="/projects">Проекты</Link>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="header__right">
                    <button className="header__dark-mode" 
                        onClick={()=>dispatch(toggleTheme())}
                    >
                        <span className="header__moon-ico">
                            {theme === 'light' ? <FaSun/> : <FaMoon/>}
                        </span>
                    </button>
                    {currentUser ? (
                        <>
                            <button className="header__profile-button">
                                <img
                                    onClick={ShowDropdownProfile}
                                    className="header__profile-img"
                                    src={currentUser.profilePicture}
                                    alt="user"
                                />
                            </button>
                            <div 
                            className={
                                isShowDropdownProfile ? `header__dropdown-profile active` : `header__dropdown-profile`
                            }
                            >
                                <ul>
                                    <div className="header__user-info">
                                        <span className="header__username">@{currentUser.student.isStudent ? currentUser.student.firstName:currentUser.username || currentUser.teacher.isTeacher && currentUser.teacher.firstName}</span>
                                        <span className="header__email">{currentUser.email}</span>
                                    </div>
                                    <div className="header__hr"></div>
                                    <Link to={'/dashboard?tab=profile'}>
                                        <li>
                                            <button>Profile</button>
                                        </li>
                                    </Link>
                                    <div className="header__hr"></div>
                                    <li>
                                        <button onClick={handleSignout}>Выйти</button>
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <Link className="header__signin-cont" to="/signin">
                            <button className="header__sign-in">
                                <span>Войти</span>
                            </button>
                        </Link>
                    )}
                    <div className="header__burger-container">
                        <div className="header__burger" onClick={ClickHandler}>
                            <HiMenu />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
