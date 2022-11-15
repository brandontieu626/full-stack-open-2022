import Person from "./Person"
const DisplayNumbers = ({persons,deleteNumber}) => {
  return (
    <>
      {persons.map(person=> <Person person={person} deleteNumber={deleteNumber}/>)}
    </>
  )
}

export default DisplayNumbers