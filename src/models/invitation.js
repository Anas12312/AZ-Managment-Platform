const mongoose = require('mongoose');
const Unit = require('./unit');
const User = require('./user');

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

schema.pre('deleteOne', {document:true, query: false}, async function(next) {
    const invetation = this

    const unit = await Unit.findById(invetation.unit)
    unit.invitations = unit.invitations.filter(inv => !inv.equals(this._id))
    await unit.save()

    const user = await User.findById(invetation.invited)
    user.invitations = user.invitations.filter(inv => !inv.equals(this._id))
    await user.save()

    next()
})

const Invitation = mongoose.model('Invitation', schema)

module.exports = Invitation;