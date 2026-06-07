import API from './axios.js'

export const getMyProfile = () => API.get('/users/me')
export const getUserProfile = (id) => API.get(`/users/${id}`)
export const updateProfile = (data) => API.put('/users/me', data)
export const addExperience = (data) => API.post('/users/me/experience', data)
export const addEducation = (data) => API.post('/users/me/education', data)
export const addSkill = (data) => API.post('/users/me/skill', data)
export const searchUsers = (q) => API.get(`/users/search?q=${q}`)