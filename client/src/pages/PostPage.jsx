import { Link, useParams } from 'react-router-dom'
import '../pages-style/PostPage.scss'
import React, { useEffect, useState } from 'react'
import { CallToAction } from '../components/CallToAction'
import { CommentSection } from '../components/CommentSection/CommentSection'
import { PostCard } from '../components/PostCard/PostCard.jsx'

export const PostPage = () => {
    const {postSlug} = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [post, setPost] = useState(null)
    const [recentPosts, setRecentPosts] = useState(null)
    console.log(post);
    useEffect(()=>{
        const fetchPost = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`)
                const data = await res.json()
                if(!res.ok){
                    setError(true)
                    setLoading(false)
                    return
                }
                if(res.ok){
                    setPost(data.posts[0])
                    setLoading(false)
                    setError(false)
                }
            } catch (error) {                
                setLoading(false)
                setError(true)
            }
        }
        fetchPost()
    },[postSlug])
    useEffect(()=>{
        try {
            const fetchRecentPosts = async () => {
                const res = await fetch(`/api/post/getposts?limit=3`)
                const data = await res.json()
                if(res.ok){
                    setRecentPosts(data.posts)
                }
            }
            fetchRecentPosts()
        } catch (error) {
            console.log(error);
        }
    },[])
    console.log(recentPosts);
    if(loading) return (<div>Загрузка...</div>)
    return (
        <main className='post-page'>
            <div className='post-page__container'>
                <h1 className='post-page__post-title'>{post && post.title}</h1>
                <Link className='post-page__category-link' to={`/search?category=${post && post.category}`}>
                    <button><span>{post && post.category}</span></button>
                </Link>
                <img src={post&&post.image} className='post-page__image' alt="" />
                <div className='post-page__date'>
                    <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className='post-page__italic'>{post && (post.content.length/1000).toFixed() } mins read </span>
                </div>
                <div className='post-page__content' dangerouslySetInnerHTML={{__html: post&&post.content}}></div>
                <div className='post-page__call-to-action'>
                    <CallToAction/>
                </div>
                <CommentSection postId={post._id}/>
                
            </div>
            <div className='post-page__recent-articles'>
                <h3>Недавние посты</h3>
                <div className='post-page__post-cards'>
                    {
                        recentPosts && (
                            recentPosts.map((post)=>(
                                <PostCard key={post._id} post={post} /> 
                            ))
                        )
                    }
                </div>
            </div>
        </main>
    )
}
