import React, {useState} from 'react';
import Popup from "./Popup";
import {removeChatRequest, updateChatInfoRequest} from "../../http/chatRequests";

const EditChatPopup = ({setChats, setIsPopupOpen, chat}) => {
    const [description, setDescription] = useState(chat.description);

    const handleEditChat = () => {
        updateChatInfoRequest(chat._id, description)
            .then(() => {
                setChats(prevState => prevState.map(item => {
                    if (item._id === chat._id) {
                        return {
                            ...item,
                            description
                        }
                    }
                    return item;
                }))
                alert('Chat info updated');
                setIsPopupOpen(false);
            })
            .catch(err => {
                alert('Error while updating chat info');
            })
    }

    const removeChat = () => {
        const isConfirmed = window.confirm('Are you sure you want to delete this chat?');
        if (!isConfirmed) {
            return
        }

        removeChatRequest(chat._id)
            .then((res) => {
                setChats(chats => chats.filter(c => c._id !== chat._id));
                alert('Chat removed');
                setIsPopupOpen(false);
            })
            .catch((err) => {
                alert('Error while removing chat');
            })
    }

    return (
        <Popup title={<span>Editing chat <br/> "{chat.title}"</span>} setIsOpen={setIsPopupOpen}>
            <div className="popup_form">
                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" value={chat.title} disabled={true}/>
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}/>
                </div>
            </div>
            <div className="service_buttons_left">
                <button className='buttonFailure' onClick={() => setIsPopupOpen(false)}>Cancel</button>
                <button className='buttonFailure' onClick={removeChat}>Delete</button>
            </div>
            <div className="service_buttons_right">
                <button className='buttonSuccess' onClick={handleEditChat}>Update</button>
            </div>
        </Popup>
    );
};

export default EditChatPopup