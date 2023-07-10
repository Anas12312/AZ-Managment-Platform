const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})
router.get('/profile', auth, async (req, res) => {
    const user = req.user
    return res.send(user)
})
router.get('/users/:username', async (req, res) => {
    const username = req.params.username

    try {
        const user = await User.findOne({username: username})

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})
router.put('/users', auth, async(req, res) => {
    const user = req.user
    try {
        await User.updateOne({_id: user._id},req.body)
        res.send("Updated Successfully")
    }catch (e) {
        console.log(e);
        res.status(500).send(e.message)
    }
})
module.exports = router