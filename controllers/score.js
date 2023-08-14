const scoreRouter = require('express').Router()
const User = require('../models/user')

scoreRouter.get('/', async (request, response) => {
  try{
    
    const user = await User.findById(request.user.id)
    response.json(user.score)
  }catch(exception){
    next(exception)
  }
})

scoreRouter.put('/', async (request, response) => {
  const user = await User.findById(request.user.id)
  
  if(request.body.operation){
    user.score++
  }else if(!request.body.operation){
    user.score--
  }
  await user.save()
  response.json(user.score)
})

module.exports = scoreRouter