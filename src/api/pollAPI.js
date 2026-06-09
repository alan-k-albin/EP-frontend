import API from './axios.js'

export const createPoll = (data) => API.post('/polls', data)
export const getPoll = (postId) => API.get(`/polls/${postId}`)
export const votePoll = (optionId) => API.post('/polls/vote', { optionId })