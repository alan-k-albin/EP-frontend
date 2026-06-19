import API from './axios.js'

export const getAdminStats = () => API.get('/admin/stats')

export const getAllUsers = (params) => API.get('/admin/users', { params })
export const deleteUser = (userId) => API.delete(`/admin/users/${userId}`)
export const banUser = (userId) => API.put(`/admin/users/${userId}/ban`)
export const promoteUser = (userId) => API.put(`/admin/users/${userId}/promote`)

export const getAllPosts = (params) => API.get('/admin/posts', { params })
export const adminDeletePost = (postId) => API.delete(`/admin/posts/${postId}`)

export const getPendingVerifications = () => API.get('/admin/verifications')
export const approveVerification = (id) => API.put(`/admin/verifications/${id}/approve`)
export const rejectVerification = (id) => API.put(`/admin/verifications/${id}/reject`)

export const getAllReports = (status) => API.get('/admin/reports', { params: { status } })
export const resolveReport = (reportId, action) => API.put(`/admin/reports/${reportId}/resolve`, { action })