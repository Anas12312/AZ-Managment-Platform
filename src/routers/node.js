const express = require('express')
const auth = require('../middleware/auth')
const Unit = require('../models/unit')
const Node = require('../models/node')

const router = new express.Router()
// Create Node
router.post('/nodes/:unitId', auth, async (req, res) => {
    const user = req.user
    const unitId = req.params.unitId
    try {
        const parentUnit = await Unit.findById(unitId)

        if(!parentUnit) {
            return res.status(404).send()
        }
        
        if(!await parentUnit.isAllowedUser(user)) {
            return res.status(401).send({error: "You Dont Have Permission to modify this Unit"});
        }

        const node = new Node(req.body)
        node.createdBy = user._id
        node.parentUnit =  parentUnit._id
        await node.save()

        parentUnit.nodes = parentUnit.nodes.concat(node._id)
        await parentUnit.save()

        res.status(201).send(node)
    } catch (error) {
        console.log(error);
        return res.status(500).send()
    }
})

// Update Node
router.put('/nodes/:nodeId', auth, async (req, res) => {
    const user = req.user
    const nodeId = req.params.nodeId
    try {
        const node = await Node.findById(nodeId);

        if(!node) return res.status(404).send({error: 'node not found'})

        node.color = req.body.color;
        node.name = req.body.name;

        await node.save()

        res.status(200).send(node)
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
            return res.status(401).send({error: "You Dont Have Permission to modify this Unit"});
        }

        await node.populate({
            path: 'resources',
            populate: {
                path: "createdBy",
                select: {_id:1, name:1, imgUrl:1, username:1}
            }
        })

        await node.populate('createdBy', {_id:1, name:1, imgUrl:1});

        if(node.createdBy._id == user.id) node.createdBy.name = 'Me'

        node.resources.forEach(res => {
            if(res.createdBy._id == user.id) res.createdBy.name = 'Me';
        })

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
        if(!node) return res.status(404).send({error: "Node not found"});

        if(!await node.isAllowedUser(user)) {
            return res.status(401).send({error: "You Dont Have Permission to modify this Unit"});
        }

        await node.deleteOne();

        res.send({message: "Deleted Successfully"})
    } catch (error) {
        console.log(e);
        res.status(500).send();
    }
})


module.exports = router