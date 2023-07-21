const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String, //Invitation, Node, Resource, Unit
        required: true,
    },
    message: {
        type: String,
    },
    actorId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    actionId: {
        type: mongoose.Types.ObjectId,
        required: true,
        refPath: 'type'
    },
    unitName: {
        type: String
    },
    nodeName: {
        type: String
    },
    seen: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now()
    }
    
}) 

const Notification = mongoose.model('Notification', schema)

module.exports = Notification