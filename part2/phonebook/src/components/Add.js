const Add = ({onSubmit,newName,newNumber,changeName,changeNumber}) => {
  return(
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={newName} onChange={changeName}/>
      </div>
      <div>
        number: <input value={newNumber} onChange={changeNumber}></input>
      </div>
      <div>
          <button type="submit">add</button>
      </div>
    </form>
  )
}

export default Add