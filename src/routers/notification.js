const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Notification = require('../models/notification')
const mongoose = require('mongoose')
router.get('/notifications', auth, async (req,res) => {
    const user = req.user
    const pageOptions = {
        page: parseInt(req.query.page, 10) || 0,
        limit: parseInt(req.query.limit, 10) || 10
    }
    try {
        await user.populate({
            path: 'notifications',
            options: {
                skip: pageOptions.page * pageOptions.limit,
                limit: pageOptions.limit,
                sort: { date: -1 }
            },
        })
        for (let i = 0; i < user.notifications.length; i++) {
            if(user.notifications[i])
            {
                await user.notifications[i].populate('actorId', { name: 1, _id: 1, username: 1, imgUrl: 1 })
                await user.notifications[i].populate('actionId')
            }
        }
        res.send(user.notifications)
    }catch(e) {
        res.status(500).send(e.message)
    }

})
//Get Unseen Notifications Count
router.get('/notifications/count', auth, async (req, res) => {
    let user = req.user;
    let count = 0;
    await user.populate('notifications');
    user.notifications.forEach(notification => {
        if(!notification.seen) {
            count++;
        }
    });
    res.status(200).send({count})
})
router.put('/notifications/seen/:id', auth,async (req, res) => {
    const notificationId = req.params.id
    const user = req.user
    const notifications = user.notifications.map(n => n.toString())
    console.log(notifications)
    if(!notifications.includes(notificationId))
    {   
        return res.status(401).send("Not Authorized")
    }
    const notification = await Notification.findById(notificationId)
    if(!notification) {
        return res.status(404).send("Notification not found")
    }
    notification.seen = true
    await notification.save()
    res.send()
})
module.exports = router;