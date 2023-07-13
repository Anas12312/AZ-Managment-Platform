const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    name_lower: {
        type: String,
        trim: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    username_lower: {
        type: String,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    },
    imgUrl: {
        type: String,
    },
    units: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Unit"
    }],
    starredUnits: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Unit"
    }],
    invitations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invitation"
    }],
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
},
{
    timestamps: true
})

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.tokens
    delete userObject.password

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('This Email Or Password may be wrong')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('This Email Or Password may be wrong')
    }

    return user
}

userSchema.pre('save', async function(next) {
    const user = this
    user.name_lower = user.name.toLowerCase()
    user.username_lower = user.username.toLowerCase()
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('updateOne', async function(next) {
    const user = this
    
    user.name_lower = user.name.toLowerCase()
    user.username_lower = user.username.toLowerCase()
    
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User