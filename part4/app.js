const express = require('express')
const config = require('./utils/config.js')
const middleware = require('./utils/middleware.js')
const app = express()

const blogsRouter = require('./controllers/blogs.js')
const usersRouter = require('./controllers/users.js')
const loginRouter = require('./controllers/login')


app.use(express.json())
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use(middleware.errorHandler)




module.exports = app;