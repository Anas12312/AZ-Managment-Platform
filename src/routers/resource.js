const express = require('express')
const auth = require('../middleware/auth')
const Unit = require('../models/unit')
const Node = require('../models/node')
const Resource = require('../models/resource')

const router = new express.Router()

// Create Resource -> node
router.post("/resource/:nodeId", auth, async(req, res) => {
    const user = req.user
    const nodeId = req.params.nodeId
    try {
        const node = await Node.findById(nodeId)
        if(!node) {
            res.status(404).send()
        }
        await node.populate("parentUnit")
        if(!node.parentUnit.users.includes(user.id)) {
            res.status(401).send("You Don't have permission to add to this node")
        }
        const resource = new Resource(req.body)
        resource.createdBy = user.id
        resource.parentNode = nodeId
        await resource.save()
        node.resources = node.resources.concat(resource._id)
        await node.save()
        res.status(201).send(resource)
    }catch(e) {
        console.log(e)
        res.status(500).send()
    }
})
// Get



module.exports = router

