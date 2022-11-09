const {model, Schema} = require('mongoose')

const blackListSchema = new Schema({
    chatNumber: {
        type: String,
        required: true
    }
})

module.exports = model('blackList', blackListSchema)