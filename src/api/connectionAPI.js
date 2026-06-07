import API from './axios.js'

export const sendRequest = (receiverId) => API.post('/connections/request', { receiverId })
export const acceptRequest = (id) => API.put(`/connections/accept/${id}`)
export const declineRequest = (id) => API.delete(`/connections/decline/${id}`)
export const removeConnection = (id) => API.delete(`/connections/remove/${id}`)
export const getMyConnections = () => API.get('/connections/my')
export const getPendingRequests = () => API.get('/connections/pending')