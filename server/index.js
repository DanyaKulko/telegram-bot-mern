const express = require('express');
const {Telegraf} = require('telegraf');
const botHandler = require('./botHandler');
const mongoose = require('mongoose');
const cors = require('cors');
const authMiddleware = require("./middlewares/authMiddleware");

require('dotenv').config();
global.bot = new Telegraf(process.env.BOT_TOKEN);
global.isBotRunning = false;

const app = express();
app.use(express.json());
app.use(cors());

const userRoutes = require('./routes/userRoutes');
const folderRoutes = require('./routes/folderRoutes');
const chatRoutes = require('./routes/chatRoutes');


app.use('/api/users', userRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/chats', chatRoutes);

app.post('/api/stopBot', authMiddleware, (req, res) => {
    bot.stop();
    global.isBotRunning = false;
    console.log('Bot was stopped');
    res.json({isBotRunning});
});
app.post('/api/startBot', authMiddleware, (req, res) => {
    bot.launch().then(() => botHandler());
    global.isBotRunning = true;
    res.json({isBotRunning});

});

const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server started at port ${port}`);
            bot.launch().then(() => botHandler());
        });
    })
    .catch(err => console.log(err));

