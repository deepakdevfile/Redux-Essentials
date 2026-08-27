import { createSlice, nanoid, createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import type { EntityState, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/App0003_store'
import { createAppAsyncThunk } from '../../app/withTypes'
import { client } from '../../api/client'
import { logout } from '../auth/App0003_authSlice'
import type { AppStartListening } from '../../app/listenerMiddleware'

export interface Reactions{
    thumbsUp: number
    tada: number
    heart: number
    rocket: number
    eyes: number
}

export type ReactionName = keyof Reactions

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

interface PostsState extends EntityState<Post, string>{
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

const postsAdapter = createEntityAdapter<Post>({
    sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const initialState: PostsState = postsAdapter.getInitialState({
    status: 'idle',
    error: null,
})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state, action: PayloadAction<{ postId: string; reaction: ReactionName }>){
            const { postId, reaction } = action.payload
            const existingPost = state.entities[postId]
            if(existingPost){
                existingPost.reactions[reaction]++
            }
        },
        postUpdated(state, action: PayloadAction<PostUpdate>){
            const { id, title, content } = action.payload
            postsAdapter.updateOne(state, {id, changes: { title, content } })
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logout.fulfilled, (state) => {
                return initialState
            })
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'pending'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                postsAdapter.setAll(state, action.payload)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'rejected'
                state.error = action.error.message ?? 'Unknown Error'
            })
            .addCase(addNewPost.fulfilled, postsAdapter.addOne)
    }
})

export default postsSlice.reducer

export const { reactionAdded, postUpdated } = postsSlice.actions

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts)

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state: RootState, userId: string) => userId],
    (posts, userId) => posts.filter((post) => post.user === userId),
)

export const selectPostsStatus = (state: RootState) => state.posts.status

export const selectPostsError = (state: RootState) => state.posts.error

export const addPostsListeners = (startAppListening: AppStartListening) => {
    startAppListening({
        actionCreator: addNewPost.fulfilled,
        effect: async(action, listenerApi) => {
            const {toast} = await import('react-tiny-toast')

            const toastId = toast.show('New post added!', {
                variant: 'success',
                position: 'bottom-right',
                pause: true,
            })

            await listenerApi.delay(5000)
            toast.remove(toastId)
        }
    })
}