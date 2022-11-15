const Person = ({person, deleteNumber}) =>{
  return(
    <div key={person.name}>
      {person.name} {person.number}
      <button onClick={()=>deleteNumber(person.id,person.name)}>delete</button>
    </div>
  )
}

export default Person