import React, {useRef, useState} from 'react';
import Popup from "./Popup";
import {sendMessageToChatRequest} from "../../http/chatRequests";
import {sendMessageToFolderRequest} from "../../http/foldersRequests";
import EmojiPicker from "emoji-picker-react";
import ContentEditable from "react-contenteditable";


const SendMessagePopup = ({setIsPopupOpen, isPopupOpen, chatOrFolder, type}) => {
    const [message, setMessage] = useState('');
    const [isEmojiOpen, setIsEmojiOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const ref = useRef(null);


    const previewHTML = message
        .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
        .replace(/~~(.*)~~/g, '<s>$1</s>')
        .replace(/\[(.*)\]\((.*)\)/g, '<a href="$2">$1</a>')
        .replace(/__(.*)__/g, '<em>$1</em>')
        .replace(/\n/g, '<br/>')
        .replace(/<br\/><br\/>/g, '<br/>')
        .replace(/&nbsp;/g, ' ');


    const handleSendMessage = () => {

        const types = {
            chat: sendMessageToChatRequest,
            folder: sendMessageToFolderRequest
        }
        const formData = new FormData();
        formData.append('id', chatOrFolder._id);
        formData.append('message', previewHTML);
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        types[type](formData)
            .then(data => {
                alert(data.data.message);
                setIsPopupOpen(false);
            })
            .catch(err => {
                alert(err.response.data.message);
            })
    }

    const change = (sign) => {
        const selection = window.getSelection();
        console.log(selection);
        const text = ref.current.props.html;
        const start = selection.anchorOffset;
        const end = selection.focusOffset;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        const selected = text.substring(start, end);
        const bolded = `${sign}${selected}${sign}`;
        const result = before + bolded + after;
        setMessage(result);
    }

    const createLink = () => {
        const selection = window.getSelection();
        const text = ref.current.props.html;
        const start = selection.anchorOffset;
        const end = selection.focusOffset;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        const selected = text.substring(start, end);
        const link = `[${selected}](https://link.com)`;
        const result = before + link + after;
        setMessage(result);
    }


    return (
        <Popup isOpen={isPopupOpen} title={<>Send message to {type}<br/>"{chatOrFolder.title}"</>}
               setIsOpen={setIsPopupOpen}>
            <div>
                <label htmlFor="title">Message</label>
                <div className='textarea_sendMessage_block'>

                    <div className="editor">
                        <div className="toolbar">
                            <button className="toolbar-button" onClick={() => change('**')}><b>B</b></button>
                            <button className="toolbar-button" onClick={() => change('__')}><em>I</em></button>
                            <button className="toolbar-button" onClick={() => change('~~')}><s>C</s></button>
                            <button className="toolbar-button" onClick={createLink}>Link</button>
                            <button className='emoji_sendMessage' onClick={() => setIsEmojiOpen(!isEmojiOpen)}>Emoji
                            </button>
                        </div>
                        <div className="editor_body">
                            <ContentEditable
                                onChange={(e) => setMessage(e.target.value)}
                                html={message}
                                disabled={false}
                                tagName='div'
                                className='editor_tab'
                                ref={ref}
                            />

                            <div dangerouslySetInnerHTML={{__html: previewHTML}} className='editor_tab'></div>
                        </div>
                    </div>
                </div>
                {isEmojiOpen && (
                    <div className='emoji_container'>
                        <div className='emojiPicker_sendMessage'>

                            <EmojiPicker
                                onEmojiClick={(emojiObject, e) => {
                                    console.log(emojiObject.getImageUrl());
                                    setMessage(message + emojiObject.emoji)
                                }}
                                autoFocusSearch={false}
                                disableAutoFocus={true}
                                disableSkinTonePicker={true}
                                height={500}
                                lazyLoadEmojis={true}
                                suggestedEmojisMode={false}
                                bottomBarMode={false}
                                previewConfig={{showPreview: false}}
                            />
                        </div>
                    </div>
                )}

            </div>

            <div className='input_file_sendMessage'>
                <input type="file" accept='image/*' onChange={(e) => setSelectedImage(e.target.files[0])}/>
            </div>
            <div className="service_buttons_left">
                <button className='buttonFailure' onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
            <div className="service_buttons_right">
                <button className='buttonSuccess' onClick={handleSendMessage}>Send</button>
            </div>

        </Popup>
    );
};

export default SendMessagePopup