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
    }
}, { timestamps: true })

const Node = mongoose.model('Node', schema)

module.exports = Node