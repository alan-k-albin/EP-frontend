import API from './axios.js'

export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const googleAuth = (data) => API.post('/auth/google', data)
export const getMe = () => API.get('/auth/me')
export const forgotPassword = (data) => API.post('/auth/forgot-password', data)
export const resetPassword = (data) => API.post('/auth/reset-password', data)