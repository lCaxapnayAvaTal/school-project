import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PostCard } from "../components/PostCard/PostCard.jsx";
import "../pages-style/Search.scss";

export const Search = () => {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        sort: "desc",
        category: "uncategorized",
    });
    console.log(sidebarData);

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);

    const location = useLocation();

    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        const sortFromUrl = urlParams.get("sort");
        const categoryFromUrl = urlParams.get("category");

        if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
                sort: sortFromUrl,
                category: categoryFromUrl,
            });
        }
        const fetchPost = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/post/getposts?${searchQuery}`);
            if (!res.ok) {
                setLoading(false);
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts);
                setLoading(false);
                if (data.posts.length === 9) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            }
        };
        fetchPost();
    }, [location.search]);
    const handleChange = (e) => {
        if (e.target.id === "searchTerm") {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value });
        }
        if (e.target.id === "sort") {
            const order = e.target.value || "desc";
            setSidebarData({ ...sidebarData, sort: order });
        }
        if (e.target.id === "category") {
            const category = e.target.value || "uncategorized";
            setSidebarData({ ...sidebarData, category });
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", sidebarData.searchTerm);
        urlParams.set("sort", sidebarData.sort);
        urlParams.set("category", sidebarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };
    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("startIndex", startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (!res.ok) {
            return;
        }
        if (res.ok) {
            const data = await res.json();
            setPosts([...posts, ...data.posts]);
            if (data.posts.length === 9) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        }
    };
    return (
        <div className="search">
            <div className="search__sidebar">
                <form className="search__form" onSubmit={handleSubmit}>
                    <div className="search__search-section">
                        <label>Искать термин:</label>
                        <div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Искать"
                                    id="searchTerm"
                                    value={sidebarData.searchTerm}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="search__search-section">
                        <label>Сортировать:</label>
                        <div>
                            <div>
                                <select
                                    onChange={handleChange}
                                    value={sidebarData.sort}
                                    id="sort"
                                >
                                    <option value="desc">Недавние</option>
                                    <option value="asc">Старые</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="search__search-section">
                        <label>Категория:</label>
                        <div>
                            <div>
                                <select
                                    onChange={handleChange}
                                    value={sidebarData.category}
                                    id="category"
                                >
                                    <option value="uncategorize">
                                        Uncategorize
                                    </option>
                                    <option value="математика">
                                        Математика
                                    </option>
                                    <option value="английский">
                                        Английский
                                    </option>
                                    <option value="модуль">модуль</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <button className="header__sign-in" type="submit">
                        <span>Применить фильтры</span>
                    </button>
                </form>
            </div>
            <div className="search__results">
                <h1>Результаты постов:</h1>
                <div className="search__posts">
                    {!loading && posts.length === 0 && <p>Посты не найдены.</p>}
                    {loading && <p>Загрузка...</p>}
                    {!loading &&
                        posts &&
                        posts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    {showMore && (
                        <button
                            className="search__showmore"
                            onClick={handleShowMore}
                        >
                            Показать больше
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
