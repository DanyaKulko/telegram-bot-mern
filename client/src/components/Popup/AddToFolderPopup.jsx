import React, {useEffect, useState} from 'react';
import Popup from "./Popup";
import {getAllFoldersRequest} from "../../http/foldersRequests";
import {addChatToFoldersRequest} from "../../http/chatRequests";

const AddToFolderPopup = ({setIsPopupOpen, chat}) => {

    const [folders, setFolders] = useState([]);
    const [selectedFolders, setSelectedFolders] = useState([]);

    useEffect(() => {
        getAllFoldersRequest().then(response => {
            setFolders(response.data);
            let selectedFolderss = [];
            response.data.forEach(folder => {
                if (folder.chatIds.some(f => f._id === chat._id)) {
                    selectedFolderss.push(folder._id);
                }
            });
            setSelectedFolders(selectedFolderss);
        })
    }, []);

    const handleCheckboxChange = (e, folder) => {
        const index = folders.findIndex(f => f._id === folder._id);
        if (e.target.checked) {
            setSelectedFolders([...selectedFolders, folder._id]);
            folders[index].chatIds = [...folders[index].chatIds, {_id: chat._id}];
        } else {
            setSelectedFolders(selectedFolders.filter(f => f !== folder._id));
            folders[index].chatIds = folders[index].chatIds.filter(c => c._id !== chat._id);
        }
        setFolders(folders);

    }

    const buttonClickHandler = () => {
        addChatToFoldersRequest(chat._id, selectedFolders).then(response => {
            alert(response.data.message);
            setIsPopupOpen(false);
        }).catch(error => {
            alert(error.response.data.message);
        })
    }


    return (
        <Popup title={<span>Update folders info for chat <br/> "{chat.title}"</span>} setIsOpen={setIsPopupOpen}>
            <div className="popup_form">
                {folders.map(folder => (
                    <div key={folder._id}>
                        <p>
                            <input type="checkbox"
                                   id={folder._id}
                                   onChange={(e) => handleCheckboxChange(e, folder)}
                                   checked={selectedFolders.includes(folder._id)}/>
                            <label htmlFor={folder._id}>{folder.title}</label>
                        </p>
                    </div>
                ))}

            </div>

            <div className="service_buttons_left">
                <button className='buttonFailure' onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
            <div className="service_buttons_right">
                <button onClick={buttonClickHandler}>Update</button>
            </div>
        </Popup>
    );
};

export default AddToFolderPopup