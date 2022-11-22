require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors= require('cors')
const app= express()
const Person=require('./models/person')

morgan.token('body',(request,response)=> request.method==='POST'? JSON.stringify(request.body):'')
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.body(req,res)
    ].join(' ')
}))

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

let phonebook = [
    { 
        'id': 1,
        'name': 'Arto Hellas', 
        'number': '040-123456'
    },
    { 
        'id': 2,
        'name': 'Ada Lovelace', 
        'number': '39-44-5323523'
    },
    { 
        'id': 3,
        'name': 'Dan Abramov', 
        'number': '12-43-234345'
    },
    { 
        'id': 4,
        'name': 'Mary Poppendieck', 
        'number': '39-23-6423122'
    }
]

app.get('/api/persons',(request,response)=>{
    Person.find({}).then(people=>{
        response.json(people)
    })
})

app.get('/info',(request,response)=>{
    Person.find({}).then(people=>{
        response.send(`<div>Phonebook has info for ${people.length} people </div> ${new Date()}`)
    })
 
})

app.get('/api/persons/:id',(request,response,next)=>{
    Person.findById(request.params.id)
        .then(note => {
            if (note){
                return response.json(note)
            }
            else{
                response.status(404).end()
            }
        })
        .catch(error=>next(error))
})

app.delete('/api/persons/:id',(request,response,next)=>{
    Person.findByIdAndRemove(request.params.id)
        .then(result=>{
            response.status(204).end()
        })
        .catch(error=>next(error))
  

})

app.post('/api/persons',(request,response,next)=>{
    const body =request.body
    console.log(body)
  
    const person=new Person({
        name:body.name,
        number:body.number
    })


    person
        .save()
        .then(savedPerson=>{
            response.json(savedPerson)
        })
        .catch((error)=>next(error))

})

app.put('/api/persons/:id',(request,response,next)=>{
    const {name,number}= request.body

    Person.findByIdAndUpdate(request.params.id, {name,number}, { new: true, runValidators:true, context:'query' })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))

})


const unknownEndpointss = (request, response) => {
    console.log('HELLOOO')
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpointss)

const errorHandler = (error,request,response,next)=>{
    console.error(error.message)
    console.log('IN THIS HANDLER')
    if (error.name==='CastError'){
        return response.status(400).send({error:'malformatted id'})
    }
    else if (error.name==='ValidationError'){
        return response.status(400).json({error:error.message})
    }

    next(error)
}

app.use(errorHandler)



//Each app.use(middleware) is called every time a request is sent to the server.
const PORT = process.env.PORT||3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})