const {Schema, model} = require('mongoose');

const folderSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String},
    chatIds: [{type: Schema.Types.ObjectId, ref: 'chat'}]
});

module.exports = model('folder', folderSchema);