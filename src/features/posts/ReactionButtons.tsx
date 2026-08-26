import { useAppDispatch } from '../../app/App0002_hooks'
import type { Post, ReactionName } from './App0003_postsSlice'
import { reactionAdded } from './App0003_postsSlice'


const reactionEmoji: Record<ReactionName, string> = {
    thumbsUp: '👍',
    tada: '🎉',
    heart: '❤️',
    rocket: '🚀',
    eyes: '👀',
}

interface ReactionButtonsProps {
    post: Post
}

export const ReactionButtons = ({ post }: ReactionButtonsProps) => {
    const dispatch = useAppDispatch()

    const reactionButtons = Object.entries(reactionEmoji).map(([stringName, emoji]) => {
        const reaction = stringName as ReactionName
        return (
            <button
                key={reaction}
                type='button'
                onClick={() => dispatch(reactionAdded({ postId: post.id, reaction }))}
            >
                {emoji}{post.reactions[reaction]}
            </button>
        )
    })

    return (
        <div> {reactionButtons} </div>
    )
}