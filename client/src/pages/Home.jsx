import React, { useEffect, useState } from "react";
import "../pages-style/Home.scss";
import { Link } from "react-router-dom";
import { CallToAction } from "../components/CallToAction";
import { PostCard } from "../components/PostCard/PostCard.jsx";

export const Home = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch("/api/post/getPosts");
            const data = await res.json();
            setPosts(data.posts);
        };
        fetchPosts();
    }, []);
    return (
        <div className="home">
            <div className="home__welcome">
                <h1>Добро пожаловать!</h1>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Culpa corporis omnis assumenda commodi deleniti cum porro
                    asperiores eligendi qui minima fugit praesentium,
                    consequuntur natus, sint consectetur at fuga veniam. Ex.
                    Cupiditate deserunt optio perferendis iure quidem alias
                    animi quam consequuntur necessitatibus libero, repudiandae
                    mollitia delectus autem, accusamus laborum vero.
                    Exercitationem nostrum suscipit reprehenderit, modi tenetur
                    a facilis cupiditate error deleniti.
                </p>
                <Link className="home__view-all-posts" to="/search">
                    Смотреть больше
                </Link>
            </div>
            <div className="home__call-to-action">
                <CallToAction />
            </div>
            <div className="home__posts-cont">
                {posts && posts.length > 0 && (
                    <div className="home__posts-wrapper">
                        <h2>Недавние посты</h2>
                        <div className="home__posts">
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                        <Link to="/search" className="home__view-all-posts">
                            Смотреть все посты
                        </Link>
                    </div>
                )}
                
            </div>
        </div>
    );
};
