const mongoose = require('mongoose')
const Schema = mongoose.Schema


const MessageSchema = new Schema({
    message: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    
},
    {timestamps: true }
)

const Message = mongoose.model('Message' , MessageSchema)

module.exports = Message;
