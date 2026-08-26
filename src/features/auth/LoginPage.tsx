import React from 'react'
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/App0003_hooks"
import { selectAllUsers } from '../users/App0003_usersSlice'
import { userLoggedIn } from './App0003_authSlice'

interface LoginPageFormFields extends HTMLFormControlsCollection{
    username: HTMLSelectElement
}

interface LoginPageFormElements extends HTMLFormElement{
    readonly elements: LoginPageFormFields
}

export const LoginPage = () => {
    const users = useAppSelector(selectAllUsers)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleSubmit = (e: React.SubmitEvent<LoginPageFormElements>) => {
        e.preventDefault()

        const username = e.currentTarget.elements.username.value
        dispatch(userLoggedIn(username))
        navigate('/posts')
    }

    const usersOptions = users.map((user: any) => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))

    return (
        <section>
            <h2>Welcome to Tweeter!</h2>
            <h3>Please log in: </h3>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">User: </label>
                <select name="username" id="username">
                    <option value=""></option>
                    {usersOptions}
                </select>
                <button>Log In</button>
            </form>
        </section>
    )
}