import React from 'react'
import { useAppSelector } from '../app/App0003_hooks'
import { useAppDispatch } from '../app/App0003_hooks'
import { selectCurrentUser } from '../features/users/App0003_usersSlice'
import { userLoggedOut } from '../features/auth/App0003_authSlice'
import { Link } from 'react-router-dom'
import { UserIcon } from './UserIcon'

export const Navbar = () => {
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectCurrentUser)

    const isLoggedIn = !!user

    let navContent: React.ReactNode = null

    if(isLoggedIn){
        const onLogoutClicked = () => {
            dispatch(userLoggedOut())
        }

        navContent = (
            <div className='navContent'>
                <div className='navLinks'>
                    <Link to="/posts">Posts</Link>
                </div>
                <div className='userDetails'>
                    <UserIcon size={32} />
                    {user.name}
                    <button className='button small' onClick={onLogoutClicked}>
                        Log Out
                    </button>
                </div>
            </div>
        )
    }

    return (
        <nav>
            <section>
                <h1>Redux Essentials Example</h1>
                {navContent}
            </section>
        </nav>
    )
}