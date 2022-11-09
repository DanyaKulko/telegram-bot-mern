import {auth_api} from './api'

export const getAllFoldersRequest = () => auth_api.get('/folders/getAll')

export const createFolderRequest = (data) => auth_api.post('/folders/create', data)

export const deleteChatFromFolderRequest = (data) => auth_api.delete('/folders/deleteChat', {params: data})

export const deleteFolderRequest = (data) => auth_api.delete('/folders/delete', {params: data})

export const sendMessageToFolderRequest = (formData) => auth_api.post('/folders/sendMessage', formData, {headers: {'Content-Type': 'multipart/form-data'}})

export const updateFolderInfoRequest = (folderId, title, description) => auth_api.post('/folders/update', {folderId, title, description})

