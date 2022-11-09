

const sendMessageToAdmin = async (message) => {
//  send message via telegram

    await bot.telegram.sendMessage(process.env.ADMIN_CHAT_ID, message);
};

module.exports = sendMessageToAdmin;