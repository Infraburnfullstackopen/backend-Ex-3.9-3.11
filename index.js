import 'dotenv/config'
import express, { json, request } from 'express'
import cors from 'cors'
import Person from './models/person.js';
const app = express();

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.log(error.message)
  
    if(error.name === "CastError"){
        return response.status(400).send({error: 'malformatted id', message: error.name})
    }else if(error.name === "ValidationError"){
        return response.status(400).json({error: error.message})
    }
    
    next(error)
}

app.use(express.static('dist'))
app.use(cors())
app.use(json())
const PORT = process.env.PORT


app.get('/', (req,res)=>{
    res.send('<h1>Hello World!</h1>')
})

app.get('/persons/', (req,res,next) => {
    Person.find({})
    .then(result => {
        res.json(result)
    })
    .catch(error => next(error))
})

app.post('/person/' , (req,res,next) => {
    const body = req.body

    if(body.name === undefined){
        return res.status(400).json(
            {
                error: "content missing"
            }
        )
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
        res.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))
})

app.get('/person/:id', (req, res,next) => {
    Person.findById(req.params.id)
    .then(note =>{
      res.json(note)
    })
    .catch(error => next(error))
  })

app.delete('/person/:id', (req,res,next) => {
    Person.findByIdAndDelete(req.params.id)
    .then(note =>{
        res.json(note)
      })
    .catch(error => next(error))
})

app.put('/person/:id', (req,res,next) => {
    const body = req.body
    console.log([req.body, body.name, body.number])

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findOneAndUpdate({_id: req.params.id}, person, {new: true})
    .then(note => {
        res.json(note)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server listening in port ${PORT}`)
})
