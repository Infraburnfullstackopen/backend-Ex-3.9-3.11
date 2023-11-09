import express, { json } from 'express'
import cors from 'cors'

const app = express();

app.use(express.static('dist'))
app.use(cors())
app.use(json())
const PORT = process.env.PORT || 3002

let persons = [
        {
            "id": 2,
            "name": "Ada Lovelace",
            "number": "39-44-5323523"
        },
        {
            "id": 4,
            "name": "Mary Poppendieck",
            "number": "39-23-6423122"
        },
        {
            "name": "Carlos Alberto",
            "number": "15425242",
            "id": 5
        }
    ]


app.get('/', (req,res)=>{
    res.json(persons)
})

app.get('/person/', (req,res) => {
    res.json(persons)
})

app.post('/person/' , (req,res) => {
    const body = req.body
    const newPerson = {
        id: parseInt(Math.random()*10000),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson)
    
    res.status(200).send(persons)
})




app.listen(PORT, () => {
    console.log(`Server listening in port ${PORT}`)
})
