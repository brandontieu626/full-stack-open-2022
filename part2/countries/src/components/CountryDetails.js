import axios from 'axios'
import {useState,useEffect} from 'react'
const CountryDetails = ({country}) => {
  const [weather,setWeather]=useState({})
  
  useEffect(()=>{
    console.log('trying to get weather ')  
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${process.env.REACT_APP_API_KEY}`)
    .then(response=>{
      console.log("got response",response.data)
      setWeather(response.data)
    })
  },[country])


  console.log('rendering country details')

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>
      <h2>languages</h2>
      <ul>
        {Object.values(country.languages).map(language=><li>{language}</li>)}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`}/>
      {weather.main? (
      <div>
        <h2>{`Weather in ${country.capital[0]}`}</h2>
        <div>temperature {(weather.main.temp-273.15).toFixed(2)} Celcius</div>
        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>
        <div>wind {weather.wind.speed} m/s</div>
      </div>)
        :null}
    </div>
  )

}

export default CountryDetails