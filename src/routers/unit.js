const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Unit = require('../models/unit')
const Node = require('../models/node')
const Invitation = require('../models/invitation')

const router = new express.Router()

//CRUD
router.post('/units', auth, async (req, res) => {
    const user = req.user
    
    if(!req.body.name) return res.status(400).send({error:'Name is required'})

    try {
        const unit = new Unit(req.body)
        await unit.save()

        // await unit.initRootNode();

        user.units = user.units.concat(unit._id)
        
        unit.owner = user._id;
        unit.ownerName = user.name;

        unit.users = unit.users.concat(user._id)
        
        await user.save()
        await unit.save()

        res.status(200).send(unit)
    } catch (e) {
        console.log(e);
        res.status(400).send({error: e.message})
    }
})

// Get All Units for User
router.get('/units', auth, async (req, res) => {
    const user = req.user
        const pageOptions = {
            page: parseInt(req.query.page, 10) || 0,
            limit: parseInt(req.query.limit, 10) || 10
        }
        try {
            //const units = await user.populate('units');
            const count = user.units.length
            const units = await user.populate({
                path: 'units',
                options: {
                    skip: pageOptions.page * pageOptions.limit,
                    limit: pageOptions.limit
                }
            })
            for(let i=0;i<count;i++) {
                await units.units[i].populate('owner', {name: 1, _id: 1, username: 1})
            }
            const response = {
                units: units.units,
                starred: user.starredUnits,
                count
            }
            res.send(response)
        } catch (e) {
            res.status(500).send()
        }
})
// Get Starred Units for User
router.get('/units/starred', auth, async (req, res) => {
    const user = req.user
        const pageOptions = {
            page: parseInt(req.query.page, 10) || 0,
            limit: parseInt(req.query.limit, 10) || 10
        }
        try {
            //const units = await user.populate('units');
            const count = user.starredUnits.length
            const units = await user.populate({
                path: 'starredUnits',
                options: {
                    skip: pageOptions.page * pageOptions.limit,
                    limit: pageOptions.limit
                }
            })
            for(let i=0;i<count;i++) {
                await units.starredUnits[i].populate('owner', {name: 1, _id: 1, username: 1})
            }
            const response = {
                units: units.starredUnits,
                count
            }
            res.send(response)
        } catch (e) {
            res.status(500).send()
        }
})

//GET Unit by Id
router.get('/units/:id', auth ,async (req, res) => {
    const _id = req.params.id
    const user = req.user
    const search = req.query.search
    try {
        const unit = await Unit.findById(_id)

        if (!unit) {
            return res.status(404).send()
        }
        if(!unit.users.includes(user._id) && unit.private === true) {
            return res.status(401).send()
        }

        await unit.populate('nodes');
        await unit.populate('owner', {name: 1, _id: 1, username: 1})
        if(search) {
            unit.nodes = unit.nodes.filter((node) => {
                if(node.name.toLowerCase().includes(search.toLowerCase())){
                    return true
                }else {
                    return false
                }
            })
        }
        res.send(unit)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

//Update Unit
router.put('/units/:id', auth, async(req, res) => {
    const user = req.user
    const _id = req.params.id
    try {
        const unit = await Unit.findById(_id)
        if(!unit) {
            return res.status(404).send()
        }
        if(!unit.owner.equals(user._id)) {
            return res.status(401).send('Not Authorized')
        }
        await Unit.updateOne({_id: _id},req.body)
        res.send("Updated Successfully")
    }catch (e) {
        console.log(e);
        res.status(500).send(e.message)
    }
})
//Delete Unit
router.delete('/units/:id', auth, async (req, res) => {
    const user = req.user
    const _id = req.params.id
    try {
        const unit = await Unit.findById(_id)
        if (!unit) {
            return res.status(404).send()
        }
        if(!unit.owner.equals(user._id)) {
            return res.status(401).send("You Are Not the Owner")
        }
        await unit.deleteOne()
        res.send("Deleted Successfully")
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message)
    }
})

//Invite users to unit
router.post("/units/invite/:invitedUserId/:unitId", auth,  async(req, res) => {
    const user = req.user
    const invitedUserId = req.params.invitedUserId
    const unitId = req.params.unitId
    try {
        const unit = await Unit.findById(unitId)
        const invitedUser = await User.findById(invitedUserId)

        if(!invitedUser) {
            return res.status(404).send('User not found')
        }
        if(!unit) {
            return res.status(404).send('Unit not found')
        }
        if(!unit.users.includes(user._id)) {
            return res.status(401).send()
        }
        if(unit.users.includes(invitedUserId)) {
            return res.status(400).send("This User Already Exists in this Unit")
        }

        const exists = await Invitation.findOne({ unit:unit._id, invited:invitedUser._id })
        if(exists) {
            return res.status(400).send("Already Invited")
        }

        const invitation = new Invitation({
            invitedBy: user._id,
            invited: invitedUser._id,
            unit: unit._id
        })

        await invitation.save()

        unit.invitations = unit.invitations.concat( invitation._id )
        invitedUser.invitations = invitedUser.invitations.concat( invitation._id )

        await unit.save()
        await invitedUser.save()

        res.send(invitation)
    }catch(e) {
        res.status(500).send()
    }
})

//Accept Invitation
router.post('/invitations/accept/:invitationId', auth, async (req, res) => {
    const invitationId = req.params.invitationId
    const user = req.user

    try {
        const invitation = await Invitation.findById(invitationId)
        if(!invitation) {
            res.status(404).send('Invitation not found')
        }
        if(user._id.toString() !== invitation.invited.toString() ) {
            res.status(401).send('Your not the invited user')
        }
        
        
        const unit = await Unit.findById(invitation.unit)
        unit.users = unit.users.concat(user._id)

        user.units = user.units.concat(unit._id)

        invitation.status = 'ACCEPTED'
        
        unit.save()
        user.save()
        invitation.save()

        res.send('Accepted')
    } catch (error) {
        res.status(500).send()
    }
})

//Decline Invitation
router.post('/invitations/decline/:invitationId', auth, async (req, res) => {
    const invitationId = req.params.invitationId
    const user = req.user

    try {
        const invitation = await Invitation.findById(invitationId)
        if(!invitation) {
            res.status(404).send('Invitation not found')
        }
        if(user._id.toString() !== invitation.invited.toString() ) {
            res.status(401).send('Your not the invited user')
        }
        
        invitation.status = 'DECLINED'
        
        invitation.save()

        res.send('Decline')
    } catch (error) {
        res.status(500).send()
    }
})


// Get All Invitations (User)
router.get('/invitations', auth, async (req,res) => {
    const user = req.user
    const filter = req.query.filter
    try {
        await user.populate('invitations')
        let invitations = user.invitations
        if(!user) {
            return res.status(404).send()
        }

        if(filter === "a") {
            invitations = invitations.filter((invitation) => invitation.status === "ACCEPTED")
        }
        if(filter === "d") {
            invitations = invitations.filter((invitation) => invitation.status === "DECLINED")
        }
        if(filter === "p") {
            invitations = invitations.filter((invitation) => invitation.status === "PENDING")
        }

        
        res.send(invitations)
    }catch(e) {
        console.log(e);
        res.status(500).send()
    }
})

// Get All Invitations (Unit)
router.get('/invitations/:id', auth, async (req,res) => {
    const unitId = req.params.id
    const filter = req.query.filter
    try {
        const unit = await Unit.findById(unitId)
        await unit.populate('invitations')
        let invitations = unit.invitations
        if(!unit) {
            return res.status(404).send()
        }

        if(filter === "a") {
            invitations = invitations.filter((invitation) => invitation.status === "ACCEPTED")
        }
        if(filter === "d") {
            invitations = invitations.filter((invitation) => invitation.status === "DECLINED")
        }
        if(filter === "p") {
            invitations = invitations.filter((invitation) => invitation.status === "PENDING")
        }

        
        res.send(invitations)
    }catch(e) {
        console.log(e);
        res.status(500).send()
    }
})
//Star Unit
router.put("/units/star/:id", auth, async(req,res) => {
    const unitId = req.params.id
    const user = req.user
    try{
        const unit = await Unit.findById(unitId)
        if(!unit) {
            return res.status(404).send({
                message: "Unit Not Found"
            })
        }
        if(!user.units.includes(unitId)) {
            return res.status(404).send({
                message: "Unit Not Found"
            })
        }
        if(user.starredUnits.includes(unitId)) {
            return res.status(400).send({
                message: "Already Starred"
            })
        }
        user.starredUnits = user.starredUnits.concat(unitId)
        user.save();
        res.send({
            message: "Starred Successfully"
        })
    }catch(e) {
        res.status(500).send(e.message)
    }
})
//Unstar Unit
router.put("/units/unstar/:id", auth, async(req,res) => {
    const unitId = req.params.id
    const user = req.user
    try{
        const unit = await Unit.findById(unitId)
        if(!unit) {
            return res.status(404).send({
                message: "Unit Not Found"
            })
        }
        if(!user.units.includes(unitId)) {
            return res.status(404).send({
                message: "Unit Not Found"
            })
        }
        if(!user.starredUnits.includes(unitId)) {
            return res.status(400).send({
                message: "Not Starred"
            })
        }
        user.starredUnits = user.starredUnits.filter((unit) => {
            return unit.toString() !== unitId
        })
        user.save();
        res.send({
            message: "Unstarred Successfully"
        })
    }catch(e) {
        res.status(500).send(e.message)
    }
})
// get Unit's users
router.get('/units/users/:id',async (req, res)=>{
    const id = req.params.id
    const unit = await Unit.findById(id)
    if(!unit) {
        return res.status(404).send({message: "Unit Not Found"})
    }
    try {
        await unit.populate('users')
        await unit.populate('owner')
        res.send(unit)
    }catch(e) {
        res.status(500).send(e.message)
    }
})

module.exports = router