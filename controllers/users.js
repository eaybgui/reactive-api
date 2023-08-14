const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (request, response) => {
    const body = request.body
    
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
  
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
      todos: [],
      score: 0
    })
    
    try{
      const savedUser = await user.save()
      response.json(savedUser)
    }catch(exception){
      response.status(400).send({error: 'username must be unique'})
    }
})  

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('todos', {content: 1, done: 1, day: 1})
    response.json(users)
  })
  
module.exports = usersRouter