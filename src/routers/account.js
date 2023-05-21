const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')

//LOGIN
router.post('/account/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    }catch(error) {
        res.status(404).send({error: error.message})
    }
})

router.post('/account/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/account/logout-all', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/account/signup', async (req, res) => {
    const user = new User(req.body)

    try {
        const exists = await User.findOne({email: req.body.email})
        if(exists) {
            return res.status(400).send({error : "Email already in user"})
        }

        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})

module.exports = router;