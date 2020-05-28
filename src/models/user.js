const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email address invalid!')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a positive number!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password must not contain the word password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

// Creating a virtual object, a way of defining relationship, data is acutally stored in a different collection
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})



// Remove unecessary data sent to user
// userSchema.methods.getPublicProfile = function() {
//     const user = this
//     const userObject = user.toObject() // returns raw object without mongoose additional things

//     delete userObject.password
//     delete userObject.tokens

//     return userObject
// }

// Will remove for every response instead of manually adding for every response
// Express calls JSON.stringify behind the scenes before sending out response
// toJSON runs everytime JSON.stringify is called behind the scenes by express
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject() // returns raw object without mongoose additional things

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)   //Second string is to confirm authenticity
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// This is a middleware function, arrow syntax doesn't work here since we need 'this' binding.
// Hash the password before saving
userSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next() //this tells the function to continue.
})

// Delete user tasks when user is removed
userSchema.post('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id})
})

const User = mongoose.model('User', userSchema)

module.exports = User