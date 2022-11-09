const {createNewChat, changeChatTitle} = require("./functions/chats");
const botHandler = () => {
    global.isBotRunning = true;
    console.log('Bot is running');

    bot.on('new_chat_members', (ctx) => {
        const {id, title} = ctx.message.chat;
        createNewChat(id, title);
        console.log("===========================================")
        console.log(ctx.message);
        console.log("===========================================")
    });

//    on group title change
    bot.on('new_chat_title', (ctx) => {
        const {id, title} = ctx.message.chat;
        changeChatTitle(id, title);
        console.log("===========================================")
        console.log(ctx.message);
        console.log("===========================================")
    });

//    on delete from chanel
    bot.on('left_chat_member', (ctx) => {
        // const {id, title} = ctx.message.chat;
        // createNewChat(title, id);
        console.log("===========================================")
        console.log(ctx.message);
        console.log("===========================================")
    });

//    on creating new group
    bot.on('group_chat_created', (ctx) => {
        const {id, title} = ctx.message.chat;
        createNewChat(id, title);
        console.log("===========================================")
        console.log(ctx);
        console.log("===========================================")
    });

};

module.exports = botHandler;