const mongoose = require('mongoose')
const validator = require('validator')

const invitationSchema = new mongoose.Schema({
    invitedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    invitedById: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
        default: Date.now()
    }
})
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
    invitations: [invitationSchema]
})

const Unit = mongoose.model('Unit', schema)

module.exports = Unit