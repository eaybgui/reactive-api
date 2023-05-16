const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

todos = [{
    "id": 1,
    "content": "Learn React",
    "days": "daily",
    "done": true
}]

app.get('/api/todos', (request, response) => {
    response.json(todos)
})

app.get('/api/todos/:id', (request, response) => {
    const id = request.params.id
    const todo = todos.find(todo => todo.id == id)

    if (todo) {
        response.json(todo)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/todos/:id', (request, response) => {
    const id = request.params.id
    todos = todos.filter(todo => todo.id != id)
    response.status(204).end()
})

app.post('/api/todos', (request, response) => {
    const todo = request.body

    const ids = todos.map(todo => todo.id)
    const maxId = Math.max(...ids)

    const newTodo = {
        id: maxId + 1,
        content: todo.todo,
        days: todo.days,
        done: false,
    }

    todos = [...todos, newTodo]
    console.log(newTodo)
    response.json(newTodo)
})

app.put('/api/todos', (request, response) => {
    const todoId = request.body.id

    //map that return either the same todo or the todo with the todo.done attribute changed
    todos = todos.map(todo => todo.id != todoId ? todo : { id: todo.id, todo: todo.todo, days: todo.days, done: !todo.done })

    response.json(todoId)
})

app.use((request, response) => {
    console.log(request.path)
    response.status(404).json({
        error: 'Not found'
    })
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})