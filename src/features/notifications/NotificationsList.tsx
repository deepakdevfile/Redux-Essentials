import classnames from 'classnames'
import { useAppDispatch, useAppSelector } from '../../app/App0003_hooks'
import { selectAllNotifications, allNotificationsRead } from './notificationsSlice'
import { TimeAgo } from '../../components/TimeAgo'
import { PostAuthor } from '../posts/PostAuthor'
import { useLayoutEffect } from 'react'



export const NotificationsList = () => {
    const notifications = useAppSelector(selectAllNotifications)
    const dispatch = useAppDispatch()

    useLayoutEffect(() => {
        dispatch(allNotificationsRead())
    })

    const renderedNotifications = notifications.map((notification) => {
        const notificationClassname = classnames('notification', {
            new: notification.isNew,
        })

        return (
            <div key={notification.id} className={notificationClassname}>
                <div>
                    <b>
                        <PostAuthor userId={notification.user} showPrefix={false}/>
                    </b> {' '}
                    {notification.message}
                </div>
                <TimeAgo timestamp={notification.date} />
            </div>
        )
    })

    return (
        <section>
            <h2>Notifications</h2>
            {renderedNotifications}
        </section>
    )
}