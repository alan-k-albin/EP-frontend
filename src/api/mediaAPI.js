import API from './axios.js'

export const uploadMedia = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return API.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const uploadProfilePhoto = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return API.post('/media/profile-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}