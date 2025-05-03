const App = () => {
  const course = {
    name: 'Two stack application development',
    parts: [
      { name: 'Coloring buttons', exercises: 10 },
      { name: 'Setting your computer on fire', exercises: 7 },
      { name: 'Touching grass', exercises: 14 },
    ],
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App

const Header = ({ course }) => <h1>{course}</h1>
const Content = ({ parts }) => (
  <>
    {parts.map(({ name, exercises }) => (
      <Part name={name} exercises={exercises} />
    ))}
  </>
)
const Total = ({ parts }) => (
  <p>
    Number of exercises {parts.reduce((sum, curr) => sum + curr.exercises, 0)}
  </p>
)

const Part = ({ name, exercises }) => (
  <p>
    {name} {exercises}
  </p>
)
