const todosRouter = require('express').Router()
const Todo = require('../models/toDo')
const User = require('../models/user')

const refresh = async () => {
  const day = new Date().getDay()
  if(day === 1)
    await Todo.find({}).updateMany({done: false})
}

refresh()

todosRouter.get('/', async (request, response) => {
  const todos = await Todo.find({})
  response.status(200).json(todos)
})

todosRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  try{
  const todo = await Todo.findById(id)
  response.status(200).json(todo)
  }catch(exception){
    next(exception)
  }
})

todosRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Todo.findByIdAndRemove(id)
  response.status(204).end()
})

todosRouter.post('/', async (request, response, next) => {
  const {content, done, day} = request.body
  
  try{
    const user = await User.findById(request.user.id)

    console.log(user, request.user)
    if(content){
      const todo = new Todo({
        content,
        done: done || false,
        user: user.id,
        day
      })
      const savedTodo = await todo.save()
      user.todos = user.todos.concat(savedTodo.id)
      await user.save()
      response.status(201).json(savedTodo)
    }else{
      response.status(400).end()
    }
  }catch(exception){
    next(exception)
  }
})

todosRouter.put('/:id', async (request, response, next) => {
  try{
    const {id} = request.params
    const todo = {...request.body, done: !request.body.done}

    const updatedTodo = await Todo.findByIdAndUpdate(id, todo, {new: true, runValidators: true})
    response.status(200).json(updatedTodo)
  }catch(exception){
    next(exception)
  }
})

module.exports = todosRouter