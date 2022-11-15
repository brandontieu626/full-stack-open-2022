const Notification = ({message}) => {
  if (message === null ){
    return <></>
  }

  if (message.includes('removed')){
    return(
      <div className="error">
      {message}
    </div>     
    )
  }

  return (
    <div className="alert">
      {message}
    </div>
  )
}

export default Notification