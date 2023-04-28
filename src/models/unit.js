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
})

const Unit = mongoose.model('Unit', schema)

module.exports = Unit