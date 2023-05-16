const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    //Info
    name: {
        type: String,
        required: true,
        trim: true
    },
    descritpion: {
        type: String,
        trim: true
    },
    //Orginization
    priority: {
        type: Number,
        default: 1
    },
    category: {
        type: String,
    },
    //Styling
    color: {
        type: String,
        default: 'default'
    },
    icon: {
        type: Buffer,
    },
    //Relation
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        def: 'User'
    },
    parentNode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Node'
    },
    parentUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit'
    },
    //Childs
    resources: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resource'
        }
     ],
    nodes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Node'
        }
    ]
}, 
{
    timestamps: true
})

const Node = mongoose.model('Node', schema)

module.exports = Node;