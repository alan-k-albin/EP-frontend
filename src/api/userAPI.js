import API from './axios.js'

export const getMyProfile = () => API.get('/users/me')
export const getUserProfile = (id) => API.get(`/users/${id}`)
export const updateProfile = (data) => API.put('/users/me', data)
export const updatePrivacy = (data) => API.put('/users/privacy', data)
export const completeOnboarding = (data) => API.put('/users/onboarding', data)
export const searchUsers = (q) => API.get(`/users/search?q=${q}`)

export const addExperience = (data) => API.post('/users/me/experience', data)
export const updateExperience = (expId, data) => API.put(`/users/me/experience/${expId}`, data)
export const deleteExperience = (expId) => API.delete(`/users/me/experience/${expId}`)

export const addEducation = (data) => API.post('/users/me/education', data)
export const updateEducation = (eduId, data) => API.put(`/users/me/education/${eduId}`, data)
export const deleteEducation = (eduId) => API.delete(`/users/me/education/${eduId}`)

export const addSkill = (data) => API.post('/users/me/skill', data)
export const deleteSkill = (skillId) => API.delete(`/users/me/skill/${skillId}`)