import React, {useState} from 'react';
import {createFolderRequest} from "../../http/foldersRequests";
import Popup from "./Popup";

const CreateFolderPopup = ({setFolders, setIsPopupOpen}) => {
    const [newFolderName, setNewFolderName] = useState('');
    const [newFolderDescription, setNewFolderDescription] = useState('');
    const [chatIds, setChatIds] = useState('');

    const handleAddFolder = () => {
        if(!newFolderName) {
            alert('Please enter folder name');
            return;
        }

        createFolderRequest({title: newFolderName, description: newFolderDescription, chatIds})
            .then(data => {
                setFolders(folders => [...folders, data.data]);
                setIsPopupOpen(false);
            })
            .catch(err => {
                alert(err.response.data.message)
            });
    }

    return (
        <Popup title='Create folder' setIsOpen={setIsPopupOpen}>
            <div className="popup_form">
                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" id='title' onChange={(e) => setNewFolderName(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <input type="text" id='description'
                           onChange={(e) => setNewFolderDescription(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="ids">ChatIds</label>
                    <textarea id='ids'
                              onChange={(e) => setChatIds(e.target.value)}/>
                </div>
            </div>


            <div className="service_buttons_left">
                <button className='buttonFailure' onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
            <div className="service_buttons_right">
                <button className='buttonSuccess' onClick={handleAddFolder}>Create</button>
            </div>

        </Popup>
    );
};

export default CreateFolderPopup