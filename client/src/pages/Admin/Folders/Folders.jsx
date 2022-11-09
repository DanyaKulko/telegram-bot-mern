import React, {useEffect, useState} from 'react';
import {deleteChatFromFolderRequest, deleteFolderRequest, getAllFoldersRequest} from "../../../http/foldersRequests";
import CreateFolderPopup from "../../../components/Popup/CreateFolderPopup";
import SendMessagePopup from "../../../components/Popup/SendMessagePopup";
import EditFolderPopup from "../../../components/Popup/EditFolderPopup";
import './Folders.css'

const Folders = () => {
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [isSendMessagePopupOpen, setIsSendMessagePopupOpen] = useState(false);
    const [isUpdateFolderPopupOpen, setIsUpdateFolderPopupOpen] = useState(false);


    useEffect(() => {
        getAllFoldersRequest()
            .then(data => {
                setFolders(data.data)
                if (data.data.length > 0) {
                    setSelectedFolder(data.data[0])
                }
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, []);

    const handleFolderClick = (folder) => {
        setSelectedFolder(folder);
    }

    const handleShowPopup = () => {
        setIsPopupOpen(true);
    }


    const handleDeleteChat = (chatId) => {
        const confirm = window.confirm('Вы действительно хотите удалить чат из папки?');
        if (!confirm) {
            return
        }
        deleteChatFromFolderRequest({chatId, folderId: selectedFolder._id})
            .then(() => {
                const newFolders = folders.map(folder => {
                    if (folder._id === selectedFolder._id) {
                        return {
                            ...folder,
                            chatIds: folder.chatIds.filter(chat => chat._id !== chatId)
                        }
                    }
                    return folder;
                })
                setSelectedFolder(newFolders.find(folder => folder._id === selectedFolder._id))
                setFolders(newFolders);
            })
            .catch(err => {
                setError(err.message);
            });
    }


    const handleEditFolder = () => {
        setIsUpdateFolderPopupOpen(true);
    }

    return (
        <div>
            <h2>Folders</h2>
            <button onClick={handleShowPopup}>Create New</button>


            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}

            {folders.length > 0 ? (
                <div className="folders_outer">
                    <div className="folders_list">
                        {folders.map(folder => (
                            <div key={folder._id}
                                 className={`folders_list_item ${folder._id === selectedFolder?._id ? 'selected_folder' : null}`}
                                 onClick={() => handleFolderClick(folder)}>
                                {folder.title}
                            </div>
                        ))}
                    </div>
                    <div className="folders_info">
                        {selectedFolder ? (
                            <div>
                                <h3>{selectedFolder.title}</h3>
                                <p>{selectedFolder.description}</p>
                                <button onClick={handleEditFolder}>Edit folder</button>
                                {selectedFolder.chatIds.length > 0 &&
                                    <button className='greenOnHover'
                                            onClick={() => setIsSendMessagePopupOpen(true)}>Send message</button>}
                                <div>
                                    {selectedFolder.chatIds.length > 0 ? selectedFolder.chatIds.map(chat => (
                                        <div key={chat._id}>
                                            {chat.title} - {chat.description} -
                                            <button
                                                className='redOnHover'
                                                onClick={() => handleDeleteChat(chat._id)}>Delete</button>
                                        </div>

                                    )) : <div>No chats</div>}
                                </div>
                            </div>
                        ) : (
                            <div className='select_folder_text'>Select folder</div>
                        )}
                    </div>
                </div>
            ) : (
                <div>No folders</div>
            )}


            {isPopupOpen && <CreateFolderPopup setFolders={setFolders} setIsPopupOpen={setIsPopupOpen}/>}
            {isSendMessagePopupOpen &&
                <SendMessagePopup setIsPopupOpen={setIsSendMessagePopupOpen} chatOrFolder={selectedFolder}
                                  type='folder'/>}
            {isUpdateFolderPopupOpen && <EditFolderPopup setSelectedFolder={setSelectedFolder} setFolders={setFolders}
                                                         setIsPopupOpen={setIsUpdateFolderPopupOpen}
                                                         folder={selectedFolder}/>}
        </div>
    )
}


export default Folders