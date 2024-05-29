import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    HiAnnotation,
    HiArrowNarrowUp,
    HiDocumentText,
    HiUserGroup,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import './DashboardComponent.scss'

export const DashboardComponent = () => {
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/user/getusers?limit=5");
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setLastMonthUsers(data.lastMonthUsers);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        const fetchPosts = async () => {
            try {
                const res = await fetch("/api/post/getposts?limit=5");
                const data = await res.json();
                if (res.ok) {
                    setPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    setLastMonthPosts(data.lastMonthPosts);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        const fetchComments = async () => {
            try {
                const res = await fetch("/api/comment/getcomments?limit=5");
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    setLastMonthComments(data.lastMonthComments);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments();
        }
    }, [currentUser]);
    return (
        <div className="dash">
            <div className="dash__item-wrapper">
                <div className="dash__item">
                    <div className="dash__total">
                        <div className="dash__total-text">
                            <h3>Общее количество пользователей</h3>
                            <p>{totalUsers}</p>
                        </div>
                        <HiUserGroup/>
                    </div>
                    <div className="dash__last-month-cont">
                        <span>
                            <HiArrowNarrowUp />
                            {lastMonthUsers}
                        </span>
                        <div className="dash__last-month">Прошлый месяц</div>
                    </div>
                </div>
                <div className="dash__item">
                    <div className="dash__total">
                        <div className="dash__total-text">
                            <h3>Общее количество комментариев</h3>
                            <p>{totalComments}</p>
                        </div>
                        <HiAnnotation className="dash__indigo"/>
                    </div>
                    <div className="dash__last-month-cont">
                        <span>
                            <HiArrowNarrowUp />
                            {lastMonthComments}
                        </span>
                        <div className="dash__last-month">Прошлый месяц</div>
                    </div>
                </div>
                <div className="dash__item">
                    <div className="dash__total">
                        <div className="dash__total-text">
                            <h3>Общее количество постов</h3>
                            <p>{totalPosts}</p>

                        </div>
                        <HiDocumentText className="dash__lime"/>
                    </div>
                    <div className="dash__last-month-cont">
                        <span>
                            <HiArrowNarrowUp />
                            {lastMonthPosts}
                        </span>
                        <div className="dash__last-month">Прошлый месяц</div>
                    </div>
                </div>
            </div>
            <div className="dash__all-sections">
                <div className="dash__recent-users">
                    <div className="dash__recent-users-top">
                        <h4 className="dash__h4">Недавние пользователи</h4>
                        <button className='header__sign-in'>
                            <span>
                                <Link className="dash__a" to={"/dashboard?tab=users"}>Смотреть все</Link>
                            </span>
                        </button>
                    </div>
                    <div className="dash__recent-users-bottom">
                        <div></div>
                        <table className="dash__table">
                            <thead className="dash__thead">
                                <tr className="dash__tr">
                                    <th className="dash__th">Фото</th>
                                    <th className="dash__th">Имя</th>
                                </tr>
                            </thead>
                            {console.log(users && users.map((user)=>console.log(user.isAdmin)))}
                            {users && users.map((user)=>(
                                <tbody key={user._id}>
                                    <tr>
                                        <td><img src={user.profilePicture} alt="user" /></td>
                                        <td>{user.student.isStudent ? user.student.firstName:user.username || user.teacher.isTeacher && user.teacher.firstName}</td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
                </div>
                <div className="dash__recent-users">
                    <div className="dash__recent-users-top">
                        <h4 className="dash__h4">Недавние комментарии</h4>
                        <button className='header__sign-in'>
                            <span>
                                <Link className="dash__a" to={"/dashboard?tab=comments"}>Смотреть все</Link>
                            </span>
                        </button>
                    </div>
                    <div className="dash__recent-users-bottom">
                        <div></div>
                        <table className="dash__table">
                            <thead className="dash__thead">
                                <tr className="dash__tr">
                                    <th className="dash__th">Комментарий</th>
                                    <th className="dash__th">Лайки</th>
                                </tr>
                            </thead>
                            {comments && comments.map((comment)=>(
                                <tbody key={comment._id}>
                                    <tr>
                                        <td><p>{comment.content}</p></td>
                                        <td>{comment.numberOfLikes}</td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
                </div>
                <div className="dash__recent-users">
                    <div className="dash__recent-users-top">
                        <h4 className="dash__h4">Недавние посты</h4>
                        <button className='header__sign-in'>
                            <span>
                                <Link className="dash__a" to={"/dashboard?tab=posts"}>Смотреть все</Link>
                            </span>
                        </button>
                    </div>
                    <div className="dash__recent-users-bottom">
                        <div></div>
                        <table className="dash__table">
                            <thead className="dash__thead">
                                <tr className="dash__tr">
                                    <th className="dash__th">Изображение</th>
                                    <th className="dash__th">Название</th>
                                    <th className="dash__th">Категория</th>
                                </tr>
                            </thead>
                            {posts && posts.map((post)=>(
                                <tbody key={post._id}>
                                    <tr>
                                        <td><img className="dash__image-post" src={post.image} alt="post" /></td>
                                        <td>{post.title}</td>
                                        <td>{post.category}</td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
                </div>  
            </div>
        </div>
    );
};
