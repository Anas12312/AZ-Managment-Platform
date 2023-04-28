const mongoose = require('mongoose')
const validator = require('validator')


const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    private: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    invitations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invitation"
    }]
})

const Unit = mongoose.model('Unit', schema)

module.exports = Unit