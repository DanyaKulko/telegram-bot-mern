import React, {useState, useEffect} from 'react';
import {getAllChatsRequest, removeChatRequest} from "../../../http/chatRequests";
import SendMessagePopup from "../../../components/Popup/SendMessagePopup";
import AddToFolderPopup from "../../../components/Popup/AddToFolderPopup";
import EditChatPopup from "../../../components/Popup/EditChatPopup";

const Chats = () => {
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSendMessagePopupOpen, setIsSendMessagePopupOpen] = useState(false);
    const [isAddToFolderPopupOpen, setIsAddToFolderPopupOpen] = useState(false);
    const [isUpdateInfoPopupOpen, setIsUpdateInfoPopupOpen] = useState(false);

    useEffect(() => {
        getAllChatsRequest()
            .then(data => setChats(data.data))
            .catch(error => setError(error))
            .finally(() => setLoading(false))
    }, []);

    const handleChatClick = (chat) => {
        setCurrentChat(chat);
        setIsSendMessagePopupOpen(true);
    }
    const handleAddToFolderClick = (chat) => {
        setCurrentChat(chat);
        setIsAddToFolderPopupOpen(true);
    }
    const handleUpdateInfoClick = (chat) => {
        setCurrentChat(chat);
        setIsUpdateInfoPopupOpen(true);
    }





    return (
        <div>
            {loading && <div>Loading...</div>}
            {error && <div>Error</div>}
            {chats.map(chat => (
                <div key={chat._id}>
                    {chat.title}
                    - <button onClick={() => handleChatClick(chat)}>Send Message</button>
                    - <button onClick={() => handleAddToFolderClick(chat)}>Update folders</button>
                    - <button onClick={() => handleUpdateInfoClick(chat)}>Edit</button>
                </div>
            ))}

            {isSendMessagePopupOpen && <SendMessagePopup setIsPopupOpen={setIsSendMessagePopupOpen} chatOrFolder={currentChat} type='chat' />}
            {isAddToFolderPopupOpen && <AddToFolderPopup setIsPopupOpen={setIsAddToFolderPopupOpen} chat={currentChat} />}
            {isUpdateInfoPopupOpen && <EditChatPopup setIsPopupOpen={setIsUpdateInfoPopupOpen} chat={currentChat} setChats={setChats} />}

        </div>
    );
};

export default Chats