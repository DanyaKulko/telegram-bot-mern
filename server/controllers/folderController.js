const Folder = require('../models/folderModel');
const Chat = require("../models/chatModel");
const BlackList = require("../models/blackListModel");
const sendMessageToAdmin = require("../functions/telegram");

const createFolder = async (req, res) => {
    try {
        const {title, chatIds, description} = req.body;
        const folder = new Folder({title, description});

        if (chatIds) {
            const chatIdArray = chatIds.split("\n").map(item => item.trim());
            console.log(chatIdArray)
            if (chatIdArray.length > 0) {
                const chatsArray = await Chat.find({idsArray: {$in: chatIdArray}})
                folder.chatIds = chatsArray.map(item => item._id);
            }
        }

        await folder.save()
        const populatedFolder = await folder.populate('chatIds');
        res.json(populatedFolder);
    } catch (err) {
        console.log(err);
        await sendMessageToAdmin(`Something went wrong in createFolder ${err}`);
    }
};

const getFolders = async (req, res) => {
    try {
        const folders = await Folder.find().populate('chatIds');
        res.json(folders);
    } catch (err) {
        console.log(err);
        await sendMessageToAdmin(`Something went wrong in getFolders ${err}`);
    }
};

const getFolder = async (req, res) => {
    try {
        const {id} = req.params;
        const folder = await Folder.findById(id).populate('chatIds');
        res.json(folder);
    } catch (err) {
        console.log(err);
        await sendMessageToAdmin(`Something went wrong in getFolder ${err}`);
    }
};

const deleteFolder = async (req, res) => {
    try {
        const {id} = req.query;
        const folder = await Folder.findByIdAndDelete(id);
        res.json(folder);
    } catch (err) {
        console.log(err);
        await sendMessageToAdmin(`Something went wrong in deleteFolder ${err}`);
    }
};

const addChatToFolder = async (req, res) => {
    try {
        const {id, chatId} = req.body;

        const folder = await Folder.findById(id);
        if (folder.chatIds.includes(chatId)) {
            return res.status(400).json({message: 'Chat already in folder'});
        }

        folder.chatIds.push(chatId);
        await folder.save();
        res.json(folder);
    } catch (err) {
        console.log(err);
        await sendMessageToAdmin(`Something went wrong in addChatToFolder ${err}`);
    }
};

const deleteChatFromFolder = async (req, res) => {
    try {
        const {folderId, chatId} = req.query;

        const folder = await Folder.findById(folderId);
        if (!folder) {
            return res.status(400).json({message: 'Folder not in folder'});
        }

        if (!folder.chatIds.includes(chatId)) {
            return res.status(400).json({message: 'Chat not in folder'});
        }

        folder.chatIds = folder.chatIds.filter(chat => chat != chatId);
        await folder.save();
        const updatedFolder = await folder.populate('chatIds');
        res.json({folder: updatedFolder});
    } catch (err) {
        console.log(err);
        await sendMessageToAdmin(`Something went wrong in deleteChatFromFolder ${err}`);
    }
};


const sendMessage = async (req, res) => {
    try {
        const folder = await Folder.findById(req.body.id).populate('chatIds');
        if (!folder) {
            return res.status(404).json({message: "Folder not found"});
        }

        if (req.file && req.file.size > 1024 * 1024 * 10) {
            return res.status(400).json({message: "File size is too big (10mb is max)"});
        }
        const blackList = await BlackList.find();
        let sentCount = 0;
        let blackListCount = 0;

        for (let chat of folder.chatIds) {
            if (blackList.some(item => chat.idsArray.includes(item.chatNumber))) {
                blackListCount++;
                continue;
            }
            sentCount++;
            try {
                if (req.file) {
                    await bot.telegram.sendPhoto(chat.chatId, {source: `./images/${req.file.filename}`}, {
                        caption: req.body.message,
                        parse_mode: 'HTML'
                    })
                } else {
                    await bot.telegram.sendMessage(chat.chatId, req.body.message, {parse_mode: 'HTML'})
                }
            } catch (e) {
                console.log(e);
                await sendMessageToAdmin(`Something went wrong in sendMessage (131) ${e}`);
                res.json({message: `Error in chat ${chat.chatId}. Total sent: ${sentCount}. Total blacklisted: ${blackListCount}`});
            }

        }
        res.json({message: `Message sent to ${sentCount} chats. ${blackListCount} chats in blacklist`});
    } catch (err) {
        console.log(err);
        await sendMessageToAdmin(`Something went wrong in sendMessage ${err}`);
    }
}

const updateFolderInfo = async (req, res) => {
    try {
        const {folderId, title, description} = req.body;
        const folder = await Folder.findById(folderId).populate('chatIds');
        if (!folder) {
            return res.status(404).json({message: "Folder not found"});
        }
        folder.title = title;
        folder.description = description;
        await folder.save();
        res.json({folder});
    } catch (err) {
        console.log(err);
        await sendMessageToAdmin(`Something went wrong in updateFolderInfo ${err}`);
    }
}

module.exports = {
    createFolder,
    getFolders,
    getFolder,
    deleteFolder,
    addChatToFolder,
    deleteChatFromFolder,
    sendMessage,
    updateFolderInfo
};