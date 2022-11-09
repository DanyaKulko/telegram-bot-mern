const Chat = require('../models/chatModel');
const sendMessageToAdmin = require("./telegram");

const createNewChat = async (chatId, title) => {
    const idsArray = title.match(/\d+/g);
    const chat = new Chat({
        title,
        chatId,
        idsArray
    });
    await chat.save()
}

const changeChatTitle = async (chatId, title) => {
    const chat = await Chat.findOne({chatId})
    if (!chat) {
        sendMessageToAdmin(`Chat with id ${chatId} not found to update`)
        return
    }
    const idsArray = title.match(/\d+/g);

    chat.title = title
    chat.idsArray = idsArray
    await chat.save()
}

module.exports = {createNewChat, changeChatTitle}