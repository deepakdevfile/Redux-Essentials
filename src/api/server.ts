import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import { factory, manyOf, primaryKey, oneOf } from '@mswjs/data'
import { nanoid } from '@reduxjs/toolkit'
import { faker } from '@faker-js/faker/locale/en'

import { parseISO } from 'date-fns'

const ARTIFICIAL_DELAY_MS = 2000

function delay(ms: number){
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function getRandomInt(min: number, max: number){
    return faker.number.int({min, max})
}

const randomFromArray = <T>(array: T[]) => {
    const index = getRandomInt(0, array.length - 1)
    return array[index]
}

const firstFromArray = <T>(items: T | T[] | readonly T[]) => {
    return ([] as T[]).concat(items)[0]
}

type ReactionName = 'thumbsUp' | 'tada' | 'heart' | 'rocket' | 'eyes'

export const db = factory({
    user: {
        id: primaryKey(nanoid),
        firstName: String,
        lastName: String,
        name: String,
        usename: String,
        posts: manyOf('post')
    },
    post: {
        id: primaryKey(nanoid),
        title: String,
        date: String,
        content: String,
        reactions: oneOf('reaction'),
        comments: manyOf('comment'),
        user: oneOf('user'),
    },
    comment: {
        id: primaryKey(String),
        data: String,
        text: String,
        post: oneOf('post')
    },
    reaction: {
        id: primaryKey(nanoid),
        thumbsUp: Number,
        tada: Number,
        heart: Number,
        rocket: Number,
        eyes: Number,
        post: oneOf('post'),
    },
})

type ModelDB = typeof db

type Post = ReturnType<typeof db.user.create>

const serializePost = (post: Post) => ({
    ...post,
    user: post.user!.id,
})

let currentUser: string | null = null

export const handlers = [
    http.post('/fakeApi/login', async function ({ request }){
        const data = (await request.json()) as { username: string }
        currentUser = data.username
        return HttpResponse.json({ success: true })
    }),

    http.post('/fakeApi/logout', async function(){
        currentUser = null
        return HttpResponse.json({ success: true })
    }),

    http.get('/fakeApi/posts', async function(){
        const posts = db.post.getAll().map(serializePost)
        await delay(ARTIFICIAL_DELAY_MS)
        return HttpResponse.json(posts)
    }),

    http.post('fakeApi/posts', async function({ request }){
        const data = (await request.json())! as Record<string, unknown>

        if('content' in data && data.content === 'error'){
            await delay(ARTIFICIAL_DELAY_MS)

            return new HttpResponse(JSON.stringify('Server error saving this post!')), {
                status: 500,
            }
        }

        data.date = new Date().toISOString()
        const userId = data.user as string 

        const user = db.user.findFirst({where: {id: {equals: userId}}})
        data.user = user
        data.reactions = db.reaction.create()

        const post = db.post.create(data)
        await delay(ARTIFICIAL_DELAY_MS)
        return HttpResponse.json(serializePost(post))
    }),

    http.get('/fakeApi/posts/:postId', async function ({params}){
        const postId = firstFromArray(params.postId)
        const post = db.post.findFirst({
            where: {id: {equals: postId}},
        })!
        await delay(ARTIFICIAL_DELAY_MS)
        return HttpResponse.json(serializePost(post))
    }),

    http.patch('/fakeApi/posts/:postId', async ({ request, params}) => {
        const { id, ...data } = (await request.json()) as Post
        const postId = firstFromArray(params.postId)
        const updatedPost = db.post.update({
            where: {id: {equals: postId}},
            data,
        })!
        await delay(ARTIFICIAL_DELAY_MS)
        return HttpResponse.json(serializePost(updatedPost))
    }),

    http.get('fakeApi/posts/:postId/comments', async ({ params }) => {
        const postId = firstFromArray(params.postId)
        const post = db.post.findFirst({
            where: {id: {equals: postId}},
        })!

        await delay(ARTIFICIAL_DELAY_MS)
        return HttpResponse.json({ comments: post.comments })
    }),

    http.post('fakeApi/posts/:postid/reactions', async ({ request, params}) => {
        const postId = firstFromArray(params.postId)
        const { reaction } = (await request.json()) as { reaction: ReactionName }
        const post = db.post.findFirst({
            where: {id: {equals: postId}},
        })!

        const updatedPost = db.post.update({
            where: {id: {equals: postId}},
            data: {
                reactions: {
                    ...post.reactions!,
                    [reaction]: (post.reactions![reaction] += 1),
                }
            }
        })!

        await delay(ARTIFICIAL_DELAY_MS)
        return HttpResponse.json(serializePost(updatedPost))
    }),

    http.get('/fakeApi/notifications', async ({ request, params }) => {
        const parsedUrl = new URL(request.url)
        const since = parsedUrl.searchParams.get('since') ?? undefined
        const numNotifications = getRandomInt(1, 5)

        let notifications = generateRandomNotifications(since, currentUser, numNotifications, db)

        await delay(ARTIFICIAL_DELAY_MS)
        return HttpResponse.json(notifications)
    }),

    http.get('/fakeApi/users', async () => {
        await delay(ARTIFICIAL_DELAY_MS)
        return HttpResponse.json(db.user.getAll())
    }),
]

export const worker = setupWorker(...handlers)

const notificationTemplates = ['poked you', 'says hi!', `is glad we're friends`, 'sent you a gift']

function generateRandomNotifications(
    since: string | undefined,
    currentUser: string | undefined,
    numNotifications: number,
    db: ModelDB
){
    const now = new Date()
    let pastDate: Date

    if(since){
        pastDate = parseISO(since)
    } else{
        pastDate = new Date(now.valueOf())
        pastDate.setMinutes(pastDate.getMinutes() - 15)
    }

    const notifications = [...Array(numNotifications)].map(() => {
        const allUsers = db.user.getAll()
        const otherUsers = allUsers.filter((user) => user.id !== currentUser)

        const user = randomFromArray(otherUsers)
        const template = randomFromArray(notificationTemplates)
        return {
            id: nanoid(),
            date: faker.data.between({ from: pastDate, to: now }).toISOString(),
            message: template,
            user: user.id,
        }
    })

    return notifications
}