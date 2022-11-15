import { useState,useEffect } from 'react'
import Search from './components/Search'
import Add from './components/Add'
import phoneService from './services/phonebook'
import Notification from './components/Notification'
import DisplayNumbers from './components/DisplayNumbers'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber,setNewNumber]= useState('')
  const [filter,setFilter]=useState('')
  const [notify,setNotify]=useState(null)

  useEffect(()=>{
    phoneService
    .getAll()
    .then(initialPersons=>
      setPersons(initialPersons))
  },[])

  let peopleToShow=persons.filter(person=> person.name.includes(filter))



  const changeName= (event) =>{
    setNewName(event.target.value)
  }

  const changeNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const changeFilter = (event) => {
    setFilter(event.target.value)
    peopleToShow=persons.filter(person=> person.name.includes(filter))
 
  }

  const addNumber = (event) =>{
    event.preventDefault()

    let exist=false
    let saveID=0
    for(let i=0;i<persons.length;i++){
      if (persons[i].name===newName){
        exist=true
        saveID=persons[i].id
        break
      }
    }

    if(exist){
      const isReplace=window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`);
      if(isReplace){
        phoneService
        .replace(saveID,{name:newName,number:newNumber,id:saveID})
        .then(returnedPerson=>{
          const updated=persons.map(person=>person.id!==saveID? person: returnedPerson)
          setPersons(updated)
          setNotify(`Changed ${returnedPerson.name} to ${returnedPerson.number}`)
          setTimeout(()=>{
            setNotify(null)
          },5000)
        })
        .catch(error=>{
          setNotify(`Information of ${newName} has already been removed from server`)
          setTimeout(()=>{
            setNotify(null)
          },5000)
        })
      }
    }
    else{
      const copy=[...persons]
      const newPerson={name:newName,number:newNumber}
      phoneService
      .create(newPerson)
      .then(returnedPerson=>{
        copy.push(returnedPerson)
        setNewName('')
        setNewNumber('')
        setPersons(copy)
        setNotify(`Added ${returnedPerson.name}`)
        setTimeout(()=>{
          setNotify(null)
        },5000)
      })
    }
  }

  const deleteNumber = (id,name) =>{
    const isDelete=window.confirm(`Delete ${name} ?`)
    if (isDelete){
      const copy=persons.filter(person=>person.id!==id)
      phoneService
      .remove(id)
      .then(removedPerson=>{
        console.log('removed')
        setPersons(copy)
      })
    }
  }
  
  console.log("RERENDERING")
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notify}/>
      <Search filter={filter} onChange={changeFilter}/>
      <h3>add a new</h3>
      <Add onSubmit={addNumber} newName={newName} newNumber={newNumber} 
      changeName={changeName} changeNumber={changeNumber}/>
      <h3>Numbers</h3>
      <DisplayNumbers persons={peopleToShow} deleteNumber={deleteNumber}/>
    </div>
  )
}

export default App
