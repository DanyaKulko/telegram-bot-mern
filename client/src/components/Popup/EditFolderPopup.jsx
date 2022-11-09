import React, {useState} from 'react';
import Popup from "./Popup";
import {deleteFolderRequest, updateFolderInfoRequest} from "../../http/foldersRequests";

const EditFolderPopup = ({folder, setIsPopupOpen, setSelectedFolder, setFolders}) => {
    const [title, setTitle] = useState(folder.title);
    const [description, setDescription] = useState(folder.description);

    const handleEditFolder = () => {
        if(!title) {
            alert('Title is required');
            return;
        }
        updateFolderInfoRequest(folder._id, title, description)
            .then((res) => {
                alert('Folder info updated');
                setSelectedFolder(res.data.folder);
                setFolders((prev) => {
                    return prev.map((folder) => {
                        if (folder._id === res.data.folder._id) {
                            return res.data.folder;
                        }
                        return folder;
                    });
                });
                setIsPopupOpen(false);
            })
    }

    const removeChat = () => {
        const isConfirmed = window.confirm('Are you sure you want to delete this folder?');
        if (!isConfirmed) {
            return
        }

        deleteFolderRequest({id: folder._id})
            .then((res) => {
                alert('Folder removed');
                setIsPopupOpen(false);
                setSelectedFolder(null);
                setFolders(folders => folders.filter(f => f._id !== folder._id));
            })
    }

    return (
        <Popup title='Edit folder info' setIsOpen={setIsPopupOpen}>
            <div className="popup_form">
                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
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
                <button className='buttonSuccess' onClick={handleEditFolder}>Update</button>
            </div>
        </Popup>
    );
};

export default EditFolderPopup