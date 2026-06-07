import API from './axios.js'

export const getNotifications = () => API.get('/notifications')
export const getUnreadCount = () => API.get('/notifications/unread')
export const markAsRead = () => API.put('/notifications/read')