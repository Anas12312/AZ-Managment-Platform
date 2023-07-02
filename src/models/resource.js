const mongoose = require('mongoose')
const dataSchema = new mongoose.Schema({
    link: {
        type: String
    },
    text: {
        type: String
    },
    imageUrl: {
        type: String
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
        trim: true
    },
    type: {
        type: String,
        required: true, //TEXT, LINKS, IMAGE, todo for each type make a viewer
    },
    data: dataSchema,
    parentNode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Node"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdByName: {
        type: String
    },
    createdByImageUrl: {
        type: String
    }
}, 
{
    timestamps: true
})

const Resource = mongoose.model('Resource', schema)

module.exports = Resource;