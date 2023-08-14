const mongoose = require('mongoose')
require('dotenv').config()

const toDoSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  day: String,
  done: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

toDoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const obj = returnedObject
    obj.id = obj._id.toString()
    delete obj._id
    delete obj.__v
    return obj
  }
})

const Todo = mongoose.model('Todo', toDoSchema)

module.exports = Todo