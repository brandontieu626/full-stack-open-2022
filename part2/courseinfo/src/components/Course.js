const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p>Number of exercises {sum}</p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {parts.map(part=> <Part part={part}/>)}
  </>

  const Course =({courses}) =>{
    return (
      <div>{courses.map(course=>{
        return <div>
          <Header course={course.name}/> 
          <Content parts={course.parts}/> 
          <Total sum={course.parts.reduce((prev,curr)=>{return prev+curr.exercises},0)}/>
          </div>
      })}</div>
    )
  }

  export default Course