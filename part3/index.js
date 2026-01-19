require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}
const Person = require('./models/person')
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('body', function (req) {
  const body = req.body
  if (body) {
    const { name, number } = body
    return `{'name':${name}, 'number':${number}}`
  }
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => response.json(persons))
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = Person.findById(id).then((person) => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
})

app.delete('/api/persons/:id', async (request, response) => {
  try {
    const id = request.params.id

    const result = await Person.findByIdAndDelete(id)
    if (result) {
      console.log('Persona borrada de la DB')
      response.status(204).end()
    } else {
      response.status(404).json({ error: 'Persona no encontrada' })
    }
  } catch (error) {
    console.error(`Persona no encontrada, ${error}`)
    response.status(400).send({ error: 'Malformatted id' })
  }
})

app.get('/info', async (request, response) => {
  const total = await Person.countDocuments({})
  response.send(`<p>Phonebook has info for ${total} people<p>
        <p>${new Date()}<p>`)
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  const person = {
    name: name,
    number: number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.post('/api/persons', async (request, response, next) => {
  const randomId = Math.floor(Math.random() * 99999)
  const body = request.body
  if (body.name.length < 3) {
    response
      .status(400)
      .json({ error: 'name must be at least 3 characters long' })
  }
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }
  try {
    const updatedPerson = await Person.findOneAndUpdate(
      { name: body.name },
      { number: body.number },
      { new: true, runValidators: true, context: 'query' },
    )
    if (updatedPerson) {
      return response.json(updatedPerson)
    }
    const person = new Person({
      name: body.name,
      number: body.number,
      id: randomId,
    })
    const savedPerson = await person.save()
    response.json(savedPerson)
  } catch (error) {
    next(error)
  }
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
