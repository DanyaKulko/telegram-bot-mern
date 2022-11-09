const Chat = require('../models/chatModel');
const Folder = require('../models/folderModel');
const BlackList = require('../models/blackListModel');
const {createNewChat} = require("../functions/chats");
const sendMessageToAdmin = require("../functions/telegram");

const createChat = async (req) => {
    await createNewChat(req.body.title, req.body.chatId);
}

const getChats = async (req, res) => {
    try {
        const chats = await Chat.find();
        res.json(chats);
    } catch (err) {
        console.log(err);
        await sendMessageToAdmin(`Something went wrong in getChats ${err}`);
    }
}

const sendMessage = async (req, res) => {
    try {
        const chat = await Chat.findById(req.body.id);
        if (!chat) {
            return res.status(404).json({message: "Chat not found"});
        }

        if (req.file && req.file.size > 1024 * 1024 * 10) {
            return res.status(400).json({message: "File size is too big (10mb is max)"});
        }

        if (req.file) {

            bot.telegram.sendPhoto(chat.chatId, {source: `./images/${req.file.filename}`}, {caption: req.body.message, parse_mode: 'HTML'}).then(() => {
                res.json({message: "Message sent"});
            }).catch((err) => {
                console.log(err)
                res.status(500).json({message: "Error sending message"});
            });
        } else {
            bot.telegram.sendMessage(chat.chatId, req.body.message, {parse_mode: 'HTML'}).then(() => {
                res.json({message: "Message sent"});
            }).catch((err) => {
                console.log(err)
                res.status(500).json({message: "Error sending message"});
            });

        }
    } catch (err) {
        console.log(err);
        await sendMessageToAdmin(`Something went wrong in sendMessage ${err}`);
    }
}

const updateChatToFolders = async (req, res) => {
    try {
        const {folderIds, chatId} = req.body;
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({message: "Chat not found"});
        }


        const folders = await Folder.find({$or: [{chatIds: {$in: chatId}}, {_id: {$in: folderIds}}]});

        folders.forEach(folder => {
            if (folderIds.includes(folder._id.toString())) {
                if (!folder.chatIds.includes(chatId)) {
                    folder.chatIds.push(chatId);
                }
            } else {
                console.log('here2');
                folder.chatIds = folder.chatIds.filter(id => id != chatId);
            }
            folder.save();
        });
        res.json({message: "Chat added to folder"});
    } catch (err) {
        console.log(err);
        await sendMessageToAdmin(`Something went wrong in updateChatToFolders ${err}`);
    }
}

const removeChat = async (req, res) => {
    try {
        const {chatId} = req.query;

        const deletedChat = await Chat.findByIdAndDelete(chatId);

        if (!deletedChat) {
            return res.status(404).json({message: "Chat not found"});
        }

        res.json({message: "Chat deleted"});
    } catch (err) {
        console.log(err);
        await sendMessageToAdmin(`Something went wrong in removeChat ${err}`);
    }
}

const updateChatInfo = async (req, res) => {
    try {

        const {chatId, description} = req.body;

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({message: "Chat not found"});
        }

        chat.description = description;
        chat.save();

        res.json({message: "Chat updated", chat});
    } catch (err) {
        console.log(err);
        await sendMessageToAdmin(`Something went wrong in updateChatInfo ${err}`);
    }
}

const addToBlackList = async (req, res) => {
    try {
        const {chatNumber} = req.body;
        if (!chatNumber) {
            return res.status(400).json({message: "Chat number is required"});
        }
        const newBlackListItem = await new BlackList({chatNumber}).save();
        res.json({newBlackListItem});
    } catch (err) {
        console.log(err);
        await sendMessageToAdmin(`Something went wrong in addToBlackList ${err}`);
    }
}
const removeFromBlackList = async (req, res) => {
    try {

        const {id} = req.query;
        if (!id) {
            return res.status(400).json({message: "Chat number is required"});
        }
        const deleted = await BlackList.findByIdAndDelete(id);
        res.json({deleted});
    } catch (err) {
        console.log(err);
        await sendMessageToAdmin(`Something went wrong in removeFromBlackList ${err}`);
    }
}

const getAllFromBlackListRequest = async (req, res) => {
    const blackList = await BlackList.find();
    res.json({blackList});
}

module.exports = {
    createChat,
    getChats,
    sendMessage,
    updateChatToFolders,
    removeChat,
    updateChatInfo,
    addToBlackList,
    removeFromBlackList,
    getAllFromBlackListRequest
}