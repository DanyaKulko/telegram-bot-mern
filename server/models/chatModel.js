const {Schema, model} = require('mongoose');

const schema = new Schema({
    title: {type: String, required: true},
    description: {type: String, default: 'none'},
    chatId: {type: Number, required: true},
    idsArray: {type: Array, default: []},
    date: {type: Date, default: Date.now()}
});

module.exports = model('chat', schema);