const express = require('express')
const app = express()
const cors = require('cors')
const midlleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const todosRouter = require('./controllers/toDo')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const scoreRouter = require('./controllers/score')

logger.info('connecting to mongodb')

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
// app.use('/api/score', scoreRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/todos', midlleware.userExtractor, todosRouter)
app.use('/api/score', midlleware.userExtractor, scoreRouter)
app.use(midlleware.unknownEndpoint)
app.use(midlleware.errorHandler)

module.exports = app