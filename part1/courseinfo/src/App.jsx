const App = () => {
  const course = 'Two stack application development'
  const parts = [
    { title: 'Coloring buttons', exercises: 10 },
    { title: 'Setting your computer on fire', exercises: 7 },
    { title: 'Touching grass', exercises: 14 },
  ]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total sum={parts.reduce((sum, curr) => sum + curr.exercises, 0)} />
    </div>
  )
}

export default App

const Header = ({ course }) => <h1>{course}</h1>
const Content = ({ parts }) => (
  <>
    {parts.map(({ title, exercises }) => (
      <p>
        {title} {exercises}
      </p>
    ))}
  </>
)
const Total = ({ sum }) => <p>Number of exercises {sum}</p>
