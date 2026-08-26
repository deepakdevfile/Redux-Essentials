import { createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/App0003_store'
import { sub } from 'date-fns'

export interface Reactions{
    thumbsUp: number
    tada: number
    heart: number
    rocket: number
    eyes: number
}

export type ReactionName = keyof Reactions

const initialReactions: Reactions = {
    thumbsUp: 0,
    tada: 0,
    heart: 0,
    rocket: 0,
    eyes: 0,
}

export interface Post {
    id: string
    title: string
    content: string 
    user: string
    date: string 
    reactions: Reactions
}

const initialState: Post[] = [
    { 
        id: '1', 
        title: 'First Post!', 
        content: 'Hello!',
        user: '0',
        date: sub(new Date(), {minutes: 10}).toISOString(),
        reactions: initialReactions,
    },
    { 
        id: '2', 
        title: 'Second Post', 
        content: 'More text',
        user: '2',
        date: sub(new Date(), {minutes: 5}).toISOString(),
        reactions: initialReactions,
    },
]

type PostUpdate = Pick<Post, 'id' | 'title' | 'content'>

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action: PayloadAction<Post>){
                state.push(action.payload)
            }, 
            prepare(title: string, content: string, userId: string ){
                return{
                    payload: {
                        id: nanoid(),
                        date: new Date().toISOString(),
                        title, 
                        content,
                        user: userId,
                        reactions: initialReactions,
                    },
                }
            },
        },
        reactionAdded(state, action: PayloadAction<{ postId: string; reaction: ReactionName }>){
            const { postId, reaction } = action.payload
            const existingPost = state.find((post) => post.id === postId)
            if(existingPost){
                existingPost.reactions[reaction]++
            }
        },
        postUpdated(state, action: PayloadAction<PostUpdate>){
            const { id, title, content } = action.payload
            const existingPost = state.find((post) => post.id === id)
            if(existingPost){
                existingPost.title = title
                existingPost.content = content
            }
        },
    }
})

export default postsSlice.reducer

export const { postAdded, reactionAdded, postUpdated } = postsSlice.actions

export const selectPostById = ( state: RootState, postId: string) => state.posts.find((post: any) => post.id === postId)