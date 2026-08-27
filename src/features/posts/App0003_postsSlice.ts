import { createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/App0003_store'
import { createAppAsyncThunk } from '../../app/withTypes'
import { client } from '../../api/client'
import { userLoggedOut } from '../auth/App0003_authSlice'

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

type NewPost = Pick<Post, 'title' | 'content' | 'user' >
type PostUpdate = Pick<Post, 'id' | 'title' | 'content'>

interface PostsState{
    posts: Post[]
    status: 'idle' | 'pending' | 'succeeded'| 'rejected'
    error: string | null
}

export const fetchPosts = createAppAsyncThunk(
    'posts/fetchPosts',
    async () => {
        const response = await client.get<Post[]>('/fakeApi/posts')
        return response.data
    }, 
    {
        condition(args, thunkApi){
            const postsStatus = selectPostsStatus(thunkApi.getState())
            if(postsStatus !== 'idle'){
                return false
            }
        },
    },
)

export const addNewPost = createAppAsyncThunk('posts/addNewPost', async(initialPost: NewPost) => {
    const response = await client.post<Post>('/fakeApi/posts', initialPost)
    return response.data
})

const initialState: PostsState = {
    posts: [],
    status: 'idle',
    error: null,
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state, action: PayloadAction<{ postId: string; reaction: ReactionName }>){
            const { postId, reaction } = action.payload
            const existingPost = state.posts.find((post) => post.id === postId)
            if(existingPost){
                existingPost.reactions[reaction]++
            }
        },
        postUpdated(state, action: PayloadAction<PostUpdate>){
            const { id, title, content } = action.payload
            const existingPost = state.posts.find((post) => post.id === id)
            if(existingPost){
                existingPost.title = title
                existingPost.content = content
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLoggedOut, (state) => {
                return initialState
            })
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'pending'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.posts = action.payload
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'rejected'
                state.error = action.error.message ?? 'Unknown Error'
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                state.posts.push(action.payload)
            })
    }
})

export default postsSlice.reducer

export const { reactionAdded, postUpdated } = postsSlice.actions

export const selectAllPosts = (state: RootState) => state.posts.posts

export const selectPostById = ( state: RootState, postId: string) => state.posts.posts.find((post: any) => post.id === postId)

export const selectPostsStatus = (state: RootState) => state.posts.status

export const selectPostsError = (state: RootState) => state.posts.error