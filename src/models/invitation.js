const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    invitedBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    invited: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit'
    },
    status: {
        type: String ,  // ACCEPTED, DECLINED, PENDING 
        default: 'PENDING'
    },
    date: {
        type: Date,
        default: Date.now()
    }
}) 

const Invitation = mongoose.model('Invitation', schema)

module.exports = Invitation;