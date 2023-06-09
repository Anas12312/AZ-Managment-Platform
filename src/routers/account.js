const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')

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
        const emailExists = await User.findOne({email: req.body.email})
        if(emailExists) {
            return res.status(400).send({error : "Email already in user"})
        }
        const userNameExists = await User.findOne({username: req.body.username})
        if(userNameExists) {
            return res.status(400).send({error : "This Username is Already Taken"})
        }
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(500).send({error: e.message})
    }
})

router.put('/account/password', auth,async (req,res) => {
    const user = req.user
    const newPassword = req.body.newPassword
    const oldPassword = req.body.oldPassword
    try {
        if(!oldPassword || !newPassword) {
            return res.status(400).send({error: 'Invaild payload'})
        }

        const userDb = await  User.findById(user._id)

        await userDb.changePassword(oldPassword, newPassword)

        return res.send({message: 'Password changed successfully'})
    }catch(err){
        res.status(400).send({error:err.message})
    }
})

module.exports = router;