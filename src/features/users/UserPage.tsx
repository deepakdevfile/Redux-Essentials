import { useAppSelector } from "../../app/App0003_hooks"
import { useParams } from "react-router-dom"
import { selectUserById } from "./App0003_usersSlice"
import { selectPostsByUser } from "../posts/App0003_postsSlice"
import { Link } from "react-router-dom"


export const UserPage = () => {
    const { userId } = useParams()

    const user = useAppSelector((state) => selectUserById(state, userId!))

    const postsForUser = useAppSelector((state) => selectPostsByUser(state, userId!))

    if(!user){
        return (
            <section>
                <h2>User not found!</h2>
            </section>
        )
    }

    const postTitles = postsForUser.map((post) => (
        <li key={post.id}>
            <Link to={`/posts/${post.id}`}> {post.title} </Link>
        </li>
    ))

    return (
        <section>
            <h2>{user.name}</h2>
            
            <ul> {postTitles} </ul>
        </section>
    )
}