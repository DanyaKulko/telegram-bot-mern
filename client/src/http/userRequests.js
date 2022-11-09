import {api, auth_api} from './api'

export const loginRequest = (payload) => api.post('users/login', payload)

export const checkAuthRequest = () => auth_api.post('users/checkAuth')
