import {useState} from 'react'

const Button = ({name,onClick}) => {
  return (
    <>
    <button onClick={onClick}>{name}</button>
    </>
  )
}

const StatisticLine = ({name,count})=>{
  if (name==="positive"){
    return(
      <div>{name} {count} %</div>
    )
  }
  return(
    <div>{name} {count}</div>
  )
}

const Statistics = ({good,neutral,bad}) =>{
  let num= (good*1)+(bad*-1)
  let avg=(num/(good+neutral+bad))
  let pavg=(good/(good+neutral+bad))*100

  if (good===0 && neutral===0 && bad===0){
    return(
      <div>No feedback given</div>
    )
  }
  return(
    <div>
      <table>
        <tr>
          <StatisticLine name='good' count={good}/>
        </tr>
        <tr>
          <StatisticLine name='neutral' count={neutral}/>
        </tr>
        <tr>
          <StatisticLine name='bad' count={bad}/>
        </tr>
        <tr>
          <StatisticLine name='all' count={good+neutral+bad}/>
        </tr>
        <tr>
          <StatisticLine name='average' count={avg}/>
        </tr>
        <tr>
          <StatisticLine name='positive' count={pavg}/>
        </tr>
      </table>
    </div>

  )
}

const App = () => {
  const [good,setGood]=useState(0)
  const [neutral,setNeutral]=useState(0)
  const [bad,setBad]=useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button name='good' onClick={()=>setGood(good+1)}/>
      <Button name='neutral' onClick={()=>setNeutral(neutral+1)}/>
      <Button name='bad' onClick={()=>setBad(bad+1)}/>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  );
}

export default App;
