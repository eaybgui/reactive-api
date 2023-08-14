const mongoose = require('mongoose')
require('dotenv').config()

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3
    },
    name: String,
    passwordHash: {
        type: String,
        required: true
    },
    todos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Todo'
        }
    ],
    score: {
        type: Number,
        default: 0
    }
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        const obj = returnedObject
        obj.id = obj._id.toString()
        delete obj._id
        delete obj.__v
        delete obj.passwordHash
        return obj
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User