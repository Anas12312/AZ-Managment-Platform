const express = require('express')
const auth = require('../middleware/auth')
const Unit = require('../models/unit')
const Node = require('../models/node')

const router = new express.Router()
// Create Node
router.post('/nodes/:parentNodeId', auth, async (req, res) => {
    const user = req.user
    const parentNodeId = req.params.parentNodeId
    try {
        const parentNode = await Node.findById(parentNodeId)

        if(!parentNode) {
            return res.status(404).send()
        }
        
        if(!await parentNode.isAllowedUser(user)) {
            return res.status(401).send("You Dont Have Permission to modify this Unit");
        }

        const node = new Node(req.body)
        node.createdBy = user._id
        node.parentNode = parentNode._id
        node.parentUnit =  parentNode.parentUnit
        await node.save()

        parentNode.nodes = parentNode.nodes.concat(node._id)
        await parentNode.save()

        res.status(201).send(node)
    } catch (error) {
        console.log(error);
        return res.status(500).send()
    }
})
// Get Node
router.get('/nodes/:nodeId',auth, async (req, res) => {
    const _id = req.params.nodeId
    const user = req.user
    try {
        const node = await Node.findById(_id)

        if (!node) {
            return res.status(404).send()
        }
        
        if(!await node.isAllowedUser(user)) {
            return res.status(401).send("You Dont Have Permission to modify this Unit");
        }

        await node.populate("nodes")
        await node.populate("resources")
        res.send(node)
    } catch (e) {
        console.log(e);
        res.status(500).send()
    }
})

// Delete Node
router.delete('/nodes/:nodeId', auth, async (req, res) => {
    const nodeId = req.params.nodeId;
    const user = req.user;
    try {
        const node = await Node.findById(nodeId);
        if(!node) return res.status(404).send("Node not found");

        if(!await node.isAllowedUser(user)) {
            return res.status(401).send("You Dont Have Permission to modify this Unit");
        }

        await node.deleteOne();

        res.send("Deleted Successfully")
    } catch (error) {
        console.log(e);
        res.status(500).send();
    }
})


module.exports = router