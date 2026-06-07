import API from './axios.js'

export const search = (q) => API.get(`/search?q=${q}`)