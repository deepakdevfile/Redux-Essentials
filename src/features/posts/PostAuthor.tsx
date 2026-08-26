import { useAppSelector } from "../../app/App0003_hooks"
import { selectUserById } from "../../features/users/App0003_usersSlice"

interface PostAuthorProps{
    userId: string
}

export const PostAuthor = ({userId}: PostAuthorProps) => {
    const author = useAppSelector((state) => selectUserById(state, userId))
    return (
        <span>by {author?.name ?? 'Unknown author'}</span>
    )
}