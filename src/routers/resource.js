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
            return res.status(404).send()
        }

        if(!node.isAllowedUser(user)) {
            return res.status(401).send("You Don't have permission to add to this node")
        }

        const resource = new Resource(req.body)
        resource.createdBy = user.id
        resource.parentNode = nodeId
        await resource.save()

        node.resources = node.resources.concat(resource._id)
        await node.save()

        await resource.populate('createdBy', {_id:1, name:1, imgUrl:1});

        res.status(201).send(resource)
    }catch(e) {
        console.log(e)
        res.status(500).send()
    }
})

//Get-Embed-Title 
router.post("/oembed", auth, async (req,res) => {
    try {
        fetch(`https://iframe.ly/api/oembed?url=${req.body.url}&api_key=3a035af461215ce4c2a7e5`)
        .then(res => res.json())
        .then(result => {
            res.send(result);
        }).catch(err => {
            res.status(400).send();
        })
    }catch(err) {
        res.status(500).send();
    }
})

// Get
router.get("/resource/:id", auth, async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    try {
        
        const resource = await Resource.findById(id);
        if(!resource) {
            return res.status(404).send("Resource not found")
        }

        const node = await Node.findById(resource.parentNode);
        if(!node.isAllowedUser(user)) {
            return res.status(401).send("You Don't have permission to add to this node");
        }

        await resource.populate('createdBy', {_id:1, name:1, imgUrl:1});

        return res.send(resource);
    } catch (error) {
        res.status(500).send()
    }
})

// Delete
router.delete("/resource/:id", auth, async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    try {
        const resource = await Resource.findById(id);
        if(!resource) {
            return res.status(404).send("Resource not found")
        }

        const node = await Node.findById(resource.parentNode);
        if(!node.isAllowedUser(user)) {
            return res.status(401).send("You Don't have permission to add to this node");
        }

        await resource.deleteOne();

        res.send("Deleted Successfully");
    } catch (error) {
        res.status(500).send()
    }
})
module.exports = router