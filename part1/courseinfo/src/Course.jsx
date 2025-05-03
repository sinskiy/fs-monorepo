const Course = ({ course }) => (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)
export default Course

const Header = ({ course }) => <h2>{course}</h2>
const Content = ({ parts }) => (
  <>
    {parts.map(({ name, exercises }) => (
      <Part key={name} name={name} exercises={exercises} />
    ))}
  </>
)
const Total = ({ parts }) => (
  <p>
    <b>
      total of {parts.reduce((sum, curr) => sum + curr.exercises, 0)} exercises
    </b>
  </p>
)

const Part = ({ name, exercises }) => (
  <p>
    {name} {exercises}
  </p>
)
