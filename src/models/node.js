const mongoose = require('mongoose')
const Resource = require('./resource')

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
        default: 'purple'
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
    // nodes: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Node'
    //     }
    // ]
}, 
{
    timestamps: true
})

schema.methods.isAllowedUser = async function(user) {
    const node = this
    
    await node.populate("parentUnit")

    return node.parentUnit.users.includes(user._id);
}

schema.pre('deleteOne', {document: true, query: false}, async function(next) {

    await Resource.deleteMany({ parentNode: this._id });

    // const nodes = await Node.find({ parentNode:this._id });

    // nodes.forEach(async res => {
    //     await res.deleteOne();
    // })

    next();
})

const Node = mongoose.model('Node', schema)

module.exports = Node;