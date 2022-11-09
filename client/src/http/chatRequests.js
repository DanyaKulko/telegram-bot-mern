import {auth_api} from './api'

export const getAllChatsRequest = () => auth_api.get('/chats/getAll')

export const sendMessageToChatRequest = (formData) => auth_api.post(`/chats/sendMessage`, formData, {headers: {'Content-Type': 'multipart/form-data'}})

export const addChatToFoldersRequest = (chatId, folderIds) => auth_api.post(`/chats/addChatToFolders`, {chatId, folderIds})

export const removeChatRequest = (chatId) => auth_api.delete(`/chats/remove`, {params: {chatId}})

export const updateChatInfoRequest = (chatId, description) => auth_api.post(`/chats/update`, {chatId, description})

export const getAllFromBlackListRequest = () => auth_api.get(`/chats/getAllFromBlackListRequest`)

export const addToBlackListRequest = (chatNumber) => auth_api.post(`/chats/addToBlackList`, {chatNumber})

export const removeFromBlackListRequest = (id) => auth_api.delete(`/chats/removeFromBlackList`, {params: {id}})

