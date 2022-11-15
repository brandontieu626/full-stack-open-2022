import {useState,useEffect} from 'react'
import axios from 'axios'
import CountryDetails from './components/CountryDetails'
const Countries = ({countries,setCountry}) => {

  return (
    <div>
      {countries.map(country=> {
        return (<div key={country.area}>
          {country.name.common}
          <button onClick={()=> setCountry(country)}>show</button>
          </div>)
      }
      )}
    </div>
  )
}

const App = () => {
  const [search,setSearch]=useState('')
  const [countries,setCountries]=useState([])
  const [country,setCountry]=useState({})


  const handleSearch = (event) => {
    setSearch(event.target.value)
    setCountry({})
  }

  const filteredCountries=countries.filter(country=> country.name.official.toLowerCase().includes(search.toLowerCase()))

  useEffect(()=>{
    axios
    .get('https://restcountries.com/v3.1/all')
    .then(response => {
      console.log(response.data)
      setCountries(response.data)
    })
  },[])


  console.log('rendering')


  return (
    <div>
      <div>
        find countries <input value={search} onChange={handleSearch}/>
      </div>
      {filteredCountries.length>10 && (<div> Too many matches, specify another filter</div>)}
      {filteredCountries.length===1 && <CountryDetails country={filteredCountries[0]}/>}
      {filteredCountries.length<=10 && filteredCountries.length>1 && <Countries countries={filteredCountries} setCountry={setCountry}/>}
      {country.name && <CountryDetails country={country}/>}
    </div>
  );
}

export default App;
