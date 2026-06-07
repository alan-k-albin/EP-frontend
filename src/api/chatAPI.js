import API from './axios.js'

export const getMyChats = () => API.get('/chat')
export const createChat = (receiverId) => API.post('/chat/create', { receiverId })
export const createGroupChat = (groupName, memberIds) => API.post('/chat/group', { groupName, memberIds })
export const getChatMessages = (id) => API.get(`/chat/${id}/messages`)
export const sendMessage = (id, data) => API.post(`/chat/${id}/messages`, data)