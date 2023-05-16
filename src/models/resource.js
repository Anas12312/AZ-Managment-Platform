const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        default: "MIX"  // MIX, TEXT, LINKS, FILES
    },
    data: [ ],
    parentNode: {
        type: mongoose.Schema.types.ObjectId,
        ref: "Node"
    },
    owner: {
        type: mongoose.Schema.types.ObjectId,
        ref: "User"
    }
}, 
{
    timestamps: true
})

const Resource = mongoose.model('Resource', schema)

module.exports = Resource;