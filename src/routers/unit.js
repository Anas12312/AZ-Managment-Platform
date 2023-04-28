const express = require('express')
const User = require('../models/user')
const Unit = require('../models/unit')
const Invitation = require('../models/invitation')
const router = new express.Router()
const auth = require('../middleware/auth')

//CRUD
router.post('/units', auth, async (req, res) => {
    const user = req.user
    const unit = new Unit(req.body)
    unit.owner = user._id;
    unit.users = unit.users.concat(user._id)
    user.units = user.units.concat(unit._id)
    try {
        await unit.save()
        await user.save()
        res.status(201).send(unit)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Get All Units for User
router.get('/units', auth, async (req, res) => {
    const user = req.user
    try {
        const units = await user.populate('units');
        res.send(units.units)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/units/:id', auth ,async (req, res) => {
    const _id = req.params.id
    const user = req.user
    try {
        const unit = await Unit.findById(_id)

        if (!unit) {
            return res.status(404).send()
        }
        if(!unit.users.includes(user._id) && unit.private === true) {
            return res.status(401).send()
        }

        res.send(unit)
    } catch (e) {
        res.status(500).send()
    }
})

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
        unit.users.forEach(async (user) => {
            console.log(user);
            const u = await User.findById(user)
            console.log(u);
            u.units = u.units.filter((unit) => !unit.equals(_id))
            await u.save()
        })
        await unit.deleteOne();
        res.send(unit.name + ": Deleted Successfully")
    } catch (e) {
        res.status(500).send()
    }
})
// invite users to unit
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
        console.log(exists);
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
        await user.save()

        res.send(invitation)
    }catch(e) {
        res.status(500).send()
    }
})

//Accept Invetation
router.post('/units/accept/:unitId', auth, (req, res) => {
    
})
module.exports = router