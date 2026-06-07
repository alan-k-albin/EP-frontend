import API from './axios.js'

export const registerUser = (formData) => API.post('/auth/register', formData)
export const loginUser = (formData) => API.post('/auth/login', formData)
export const getMe = () => API.get('/auth/me')