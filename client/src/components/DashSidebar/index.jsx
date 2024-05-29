import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
    HiUser,
    HiArrowSmRight,
    HiDocumentSearch,
    HiDocumentText,
    HiOutlineUserGroup,
    HiAnnotation,
    HiChartPie,
    HiClipboardList,
} from "react-icons/hi";
import { PiStudentBold } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import "./DashSidebar.scss";
import { signoutSuccess } from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export const DashSidebar = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const location = useLocation();
    const [tab, setTab] = useState("");
    const handleSignout = async () => {
        try {
            const res = await fetch("/api/user/signout", {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else dispatch(signoutSuccess());
        } catch (error) {
            console.log(error.message);
        }
    };
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);
    return (
        <nav className="dashsidebar__nav">
            <div className="dashsidebar__div-one">
                <div className="dashsidebar__div-two">
                    <ul className="dashsidebar__ul">
                        {currentUser && currentUser.isAdmin && (
                            <li>
                                <Link
                                    to={"/dashboard?tab=dash"}
                                    className={
                                        tab === "dash"
                                            ? "dashsidebar__a active"
                                            : "dashsidebar__a"
                                    }
                                >
                                    <HiChartPie />
                                    <span className="dashsidebar__link-name">
                                        <div className="dashsidebar__link">
                                            Панель приборов
                                        </div>
                                    </span>
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link
                                to="/dashboard?tab=profile"
                                className={
                                    tab === "profile"
                                        ? "dashsidebar__a active"
                                        : "dashsidebar__a"
                                }
                            >
                                <HiUser />
                                <span className="dashsidebar__link-name">
                                    <div className="dashsidebar__link">
                                        Профиль
                                    </div>
                                </span>
                                <span className="dashsidebar__user-mark">
                                    <span>
                                        {(currentUser.isAdmin && "Админ") ||
                                            (currentUser.teacher.isTeacher &&
                                                "Учитель") ||
                                            (currentUser.student.isStudent &&
                                                "Ученик") ||
                                            (!currentUser.isAdmin &&
                                                !currentUser.teacher
                                                    .isTeacher &&
                                                "Пользователь")}
                                    </span>
                                </span>
                            </Link>
                        </li>
                        {currentUser.isAdmin && (
                            <li>
                                <Link
                                    to="/dashboard?tab=posts"
                                    className={
                                        tab === "posts"
                                            ? "dashsidebar__a active"
                                            : "dashsidebar__a"
                                    }
                                >
                                    <HiDocumentText />
                                    <span className="dashsidebar__link-name">
                                        <div className="dashsidebar__link">
                                            Посты
                                        </div>
                                    </span>
                                </Link>
                            </li>
                        )}
                        {currentUser.isAdmin && (
                            <>
                                <li>
                                    <Link
                                        to="/dashboard?tab=users"
                                        className={
                                            tab === "users"
                                                ? "dashsidebar__a active"
                                                : "dashsidebar__a"
                                        }
                                    >
                                        <HiOutlineUserGroup />
                                        <span className="dashsidebar__link-name">
                                            <div className="dashsidebar__link">
                                                Пользователи
                                            </div>
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/dashboard?tab=comments"
                                        className={
                                            tab === "comments"
                                                ? "dashsidebar__a active"
                                                : "dashsidebar__a"
                                        }
                                    >
                                        <HiAnnotation />
                                        <span className="dashsidebar__link-name">
                                            <div className="dashsidebar__link">
                                                Комментарии
                                            </div>
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/dashboard?tab=schedule"
                                        className={
                                            tab === "schedule"
                                                ? "dashsidebar__a active"
                                                : "dashsidebar__a"
                                        }
                                    >
                                        <HiClipboardList />
                                        <span className="dashsidebar__link-name">
                                            <div className="dashsidebar__link">
                                                Расписание
                                            </div>
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/dashboard?tab=createTeacher"
                                        className={
                                            tab === "createTeacher"
                                                ? "dashsidebar__a active"
                                                : "dashsidebar__a"
                                        }
                                    >
                                        <FaChalkboardTeacher />
                                        <span className="dashsidebar__link-name">
                                            <div className="dashsidebar__link">
                                                Добавить учителя
                                            </div>
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/dashboard?tab=createStudent"
                                        className={
                                            tab === "createStudent"
                                                ? "dashsidebar__a active"
                                                : "dashsidebar__a"
                                        }
                                    >
                                        <PiStudentBold />
                                        <span className="dashsidebar__link-name">
                                            <div className="dashsidebar__link">
                                                Добавить студента
                                            </div>
                                        </span>
                                    </Link>
                                </li>
                            </>
                        )}
                        {currentUser.teacher.isTeacher && (
                            <li>
                                <Link
                                    to="/dashboard?tab=teacherschedule"
                                    className={
                                        tab === "teacherschedule"
                                            ? "dashsidebar__a active"
                                            : "dashsidebar__a"
                                    }
                                >
                                    <HiClipboardList />
                                    <span className="dashsidebar__link-name">
                                        <div className="dashsidebar__link">
                                            Расписание
                                        </div>
                                    </span>
                                </Link>
                            </li>
                        )}
                        {currentUser.student.isStudent&&(
                            <li>
                                <Link
                                    to="/dashboard?tab=studentschedule"
                                    className={
                                        tab === "studentschedule"
                                            ? "dashsidebar__a active"
                                            : "dashsidebar__a"
                                    }
                                >
                                    <HiClipboardList />
                                    <span className="dashsidebar__link-name">
                                        <div className="dashsidebar__link">
                                            Расписание
                                        </div>
                                    </span>
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link
                                className="dashsidebar__a"
                                onClick={handleSignout}
                            >
                                <HiArrowSmRight />
                                <span className="dashsidebar__link-name">
                                    <div className="dashsidebar__link">
                                        Выйти
                                    </div>
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};
