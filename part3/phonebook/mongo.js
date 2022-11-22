const mongoose= require('mongoose')


const password=process.argv[2]

const url=`mongodb+srv://btieu626:${password}@cluster0.aelqkoo.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema= new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person',personSchema)

if(process.argv.length==3){
    mongoose
        .connect(url)
        .then((result)=>{
            Person.find({}).then(result=>{
                result.forEach(note=>{
                    console.log(note)
                })
                mongoose.connection.close()
            })
        })
}
else{
    mongoose
        .connect(url)
        .then((result)=>{
            const person = new Person({
                name:process.argv[3],
                number:process.argv[4]
            })

            console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)

            return person.save()
        })
        .then(()=>{
            console.log('note saved!')
            return mongoose.connection.close()
        })
        .catch((err)=>console.log(err))
}
