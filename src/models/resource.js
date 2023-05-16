const mongoose = require('mongoose')
const dataSchema = new mongoose.Schema({
    link: {
        type: String
    },
    text: {
        type: String
    },
    file: {
        type: String
    },
    data:{}

})
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
    data: dataSchema,
    parentNode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Node"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, 
{
    timestamps: true
})

const Resource = mongoose.model('Resource', schema)

module.exports = Resource;