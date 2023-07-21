const Notification = require('../models/notification')
const User = require('../models/user')
const invitationNotification = async (userId, invitedById, invitationId, unitName) => {
    const notification = new Notification({
        userId: userId,
        type: 'Invitation',
        actorId: invitedById,
        actionId: invitationId,
        unitName: unitName
    })
    await notification.save()
    const user = await User.findById(userId)
    if(user) {
        user.notifications = user.notifications.concat(notification._id)
        await user.save()
    }
}

const joindedUnitNotification = async (usersIds, newMemberId, unitId) => {
    try {
        for(let i = 0; i < usersIds.length ;i++) {
            if(usersIds[i].toString() !== newMemberId.toString()) {
                const notification = new Notification({
                    userId: usersIds[i],
                    type: 'Unit',
                    actorId: newMemberId,
                    actionId: unitId,
                })
                await notification.save()
                const user = await User.findById(usersIds[i])
                if(user) {
                    user.notifications = user.notifications.concat(notification._id)
                    await user.save()
                }
            }
        }
    }catch(e) {
        console.log(e)
    }
}
const nodeCreatedNotification = async (usersIds, createdById, nodeId, unitName) => {
    try {
        for(let i = 0; i < usersIds.length ;i++) {
            if(usersIds[i].toString() !== createdById.toString()) {
                const notification = new Notification({
                    userId: usersIds[i],
                    type: 'Node',
                    actorId: createdById,
                    actionId: nodeId,
                    unitName: unitName
                })
                await notification.save()
                const user = await User.findById(usersIds[i])
                if(user) {
                    user.notifications = user.notifications.concat(notification._id)
                    await user.save()
                }
            }
        }
    }catch(e) {
        console.log(e)
    }
}
const resourceAddedNotification = async (usersIds, createdById, resourceId, nodeName, unitName) => {
    try {
        for(let i = 0; i < usersIds.length ;i++) {
            if(usersIds[i].toString() !== createdById.toString()) {
                const notification = new Notification({
                    userId: usersIds[i],
                    type: 'Resource',
                    actorId: createdById,
                    actionId: resourceId,
                    message: "CREATE",
                    nodeName: nodeName,
                    unitName: unitName
                })
                await notification.save()
                const user = await User.findById(usersIds[i])
                if(user) {
                    user.notifications = user.notifications.concat(notification._id)
                    await user.save()
                }
            }
        }
    }catch(e) {
        console.log(e)
    }
}
const resourceEditedNotification = async (usersIds, editedById, resourceId, nodeName, unitName) => {
    try {
        for(let i = 0; i < usersIds.length ;i++) {
            if(usersIds[i].toString() !== editedById.toString()) {
                const notification = new Notification({
                    userId: usersIds[i],
                    type: 'Resource',
                    actorId: editedById,
                    actionId: resourceId,
                    message: "EDIT",
                    unitName,
                    nodeName
                })
                await notification.save()
                const user = await User.findById(usersIds[i])
                if(user) {
                    user.notifications = user.notifications.concat(notification._id)
                    await user.save()
                }
            }
        }
    }catch(e) {
        console.log(e)
    }
}
module.exports = {
    invitationNotification,
    joindedUnitNotification,
    nodeCreatedNotification,
    resourceAddedNotification,
    resourceEditedNotification
}