const mongoose=require('mongoose')

const url = process.env.MONGODB_URI


console.log('connecting to ', url)

mongoose
    .connect(url)
    .then((result)=>{
        console.log('connected to MongoDB')
    })
    .catch((error)=>{
        console.log('failed to connect to MongoDB')
    })

const validators =[
    {
        validator: (number)=>{
            if((number[2]==='-'||number[3]==='-' && number.length<9)){
                return false
            }

            return true
        },
        message:'Must be atleast 8 digits'
    },
]
const personSchema = new mongoose.Schema({
    name:{
        type:String,
        minLength:3,
        required: true
    },
    number:{
        type:String,
        minLength:8,
        validate:validators,
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person',personSchema)