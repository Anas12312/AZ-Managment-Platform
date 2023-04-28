const mongoose = require('mongoose')
const validator = require('validator')
const Invitation = require('./invitation')
const User = require('./user')

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

schema.pre('deleteOne', {document:true, query: false}, async function(next) {
    const unit = this

    await Invitation.deleteMany({ unit: unit._id})

    await unit.populate('users')

    unit.users.forEach(async (user) => {
        user.units = user.units.filter((u) => u.toString() !== unit._id.toString() )
        await user.save()
    })

    next()
})


const Unit = mongoose.model('Unit', schema)

module.exports = Unit