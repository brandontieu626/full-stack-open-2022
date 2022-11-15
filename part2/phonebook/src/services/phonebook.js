import axios from 'axios'
const baseUrl='http://localhost:3001/persons'


const getAll = () =>{
  const request=axios.get(baseUrl)
  return request.then(response=>response.data)
}

const create = note => {
  const request=axios.post(baseUrl,note)
  return request.then(response=>response.data)
}

const remove = id =>{
  const request=axios.delete(`${baseUrl}/${id}`)
  return request.then(response=>response.data)
}

const replace = (id,person) =>{
  const request=axios.put(`${baseUrl}/${id}`,person)
  return request.then(response=>response.data)
}

export default {getAll,create,remove,replace}