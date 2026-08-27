import type React from 'react'
import { useAppSelector } from '../../app/App0003_hooks'
import { selectPostsStatus, selectPostsError, fetchPosts, selectPostIds, selectPostById } from './App0003_postsSlice'
import { Spinner } from '../../components/Spinner'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from '../../components/TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { useAppDispatch } from '../../app/App0003_hooks'
import { useEffect } from 'react'

interface PostExcerptProps {
    postId: string
}

function PostExcerpt({ postId }: PostExcerptProps){
    const post = useAppSelector((state) => selectPostById(state, postId))
    return (
        <article>
            <h3>
                <Link to={`/posts/${post.id}`}> {post.title} </Link>
            </h3>
            <div>
                <PostAuthor userId={post.user} />
                <TimeAgo timestamp={post.date} />
            </div>
            <p className='post-content'> {post.content.substring(0, 100)} </p>
            <ReactionButtons post={post}/>
        </article>
    )
}

export const PostsList = () => {
    const orderedPostIds = useAppSelector(selectPostIds)
    const postStatus = useAppSelector(selectPostsStatus)
    const postsError = useAppSelector(selectPostsError)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if(postStatus === 'idle'){
            dispatch(fetchPosts())
        }
    }, [postStatus, dispatch])

    let content: React.ReactNode

    if(postStatus === 'pending'){
        content = <Spinner text="Loading..." />
    } else if(postStatus === "succeeded"){
        content = orderedPostIds.map((postId) => <PostExcerpt key={postId} postId={postId} />)
    } else if (postStatus === 'rejected'){
        content = <div> {postsError} </div>
    }

    return (
        <section className='posts-list'>
            <h2>Posts</h2>
            {content}
        </section>
    )
}