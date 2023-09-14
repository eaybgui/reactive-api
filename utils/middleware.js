const jwt = require('jsonwebtoken')
require('dotenv').config()

const userExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    const token = authorization.substring(7)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    request.user = decodedToken
  }
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if(error.name === 'CastError'){
      return response.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError'){
      return response.status(400).json({ error: error.message })
  } else if(error.name === 'JsonWebTokenError'){
      return response.status(401).json({ error: error.message, })
  }
  next(error)
}

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' })
  next()
}

module.exports = {
  errorHandler,
  unknownEndpoint,
  userExtractor,
}