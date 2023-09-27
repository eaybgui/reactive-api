const todosRouter = require('express').Router()
const User = require('../models/user')
const Todo = require('../models/toDo')


todosRouter.get('/', async (request, response, next) => {
  try{
    const todos = await Todo.find({ user: request.user.id })
    response.status(200).json(todos)
  }catch(exception){
    next(exception)
  }
})

todosRouter.get('/:id', async (request, response, next) => {
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
  
  try{
    const user = await User.findById(request.user.id)
    let todos = []
    for(let i of request.body){
      console.log(i)
      if(i.content){
        const todo = new Todo({
          content: i.content,
          done: false,
          user: user.id,
          day: i.day
        })
        const savedTodo = await todo.save()
        todos.push(savedTodo)
        user.todos = user.todos.concat(savedTodo.id)
      }else{
        response.status(400).end()
      }
    }
    await user.save()
    response.status(201).json(todos)
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

const refresh = async () => {
  const day = new Date().getDay()
  if(day === 1)
    await Todo.find({}).updateMany({done: false})
}

refresh()

module.exports = todosRouter