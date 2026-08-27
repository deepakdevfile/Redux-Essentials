import React, { useState } from "react"
import { useAppDispatch } from "../../app/App0003_hooks"
import { addNewPost } from './App0003_postsSlice'
import { useAppSelector } from "../../app/App0003_hooks"
import { selectCurrentUsername } from "../auth/App0003_authSlice"

interface AddPostFormFields extends HTMLFormControlsCollection {
    postTitle: HTMLInputElement
    postContent: HTMLTextAreaElement
}
interface AddPostFormElements extends HTMLFormElement {
    readonly elements: AddPostFormFields
}

export const AddPostForm = () => {
    const [addRequestStatus, setAddRequestStatus] = useState<'idle' | 'pending'>('idle')
    const dispatch = useAppDispatch()
    const userId = useAppSelector(selectCurrentUsername)!

    const handleSubmit = async (e: React.SubmitEvent<AddPostFormElements>) => {
        e.preventDefault()

        const { elements } = e.currentTarget
        const title = elements.postTitle.value
        const content = elements.postContent.value

        const form = e.currentTarget

        try{
            setAddRequestStatus('pending')
            await dispatch(addNewPost({title, content, user: userId}))
            form.reset()
            // await dispatch(postAdded(title, content, userId))
        } catch (err){
            console.log('Failed to save the post: ', err)
        } finally {
            setAddRequestStatus('idle')
        }

        e.currentTarget.reset()
    }

    return (
        <section>
            <h2>Add a New Post</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="postTitle">Post Title:</label>
                <input type="text" id="postTitle" defaultValue="" required />
                <label htmlFor="postContent">Content:</label>
                <textarea id="postContent" name="postContent" defaultValue="" required />
                <button disabled={addRequestStatus === 'pending'}>Save Post</button>
            </form>
        </section>
    )
}