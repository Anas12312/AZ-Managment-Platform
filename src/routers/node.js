const express = require('express')
const auth = require('../middleware/auth')
const Unit = require('../models/unit')
const Node = require('../models/node')

const router = new express.Router()

router.get('/node/:unitId', auth, async (req, res) => {
    const user = req.user
    const unitId = req.params.unitId
    try {
        const unit = Unit.findById(unitId)
        if(!unit) {
            res.status(404).send('Unit is not found')
        }
        const node = new Node({
            name: req.body.name,
            descritpion: req.body.descritpion,
            color: req.body.color,
            createdBy: user._id,
            
        })
    } catch (error) {
        
    }
})

module.exports = router