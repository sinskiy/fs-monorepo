import { Fragment } from 'react'

interface CoursePartBase {
  name: string
  exerciseCount: number
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string
}

interface CoursePartBasic extends CoursePartWithDescription {
  kind: 'basic'
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number
  kind: 'group'
}

interface CoursePartBackground extends CoursePartWithDescription {
  backgroundMaterial: string
  kind: 'background'
}

interface CoursePartSpecial extends CoursePartWithDescription {
  requirements: string[]
  kind: 'special'
}

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial

const App = () => {
  const courseName = 'Half Stack application development'
  const courseParts: CoursePart[] = [
    {
      name: 'Fundamentals',
      exerciseCount: 10,
      description: 'This is an awesome course part',
      kind: 'basic',
    },
    {
      name: 'Using props to pass data',
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: 'group',
    },
    {
      name: 'Basics of type Narrowing',
      exerciseCount: 7,
      description: 'How to go from unknown to string',
      kind: 'basic',
    },
    {
      name: 'Deeper type usage',
      exerciseCount: 14,
      description: 'Confusing description',
      backgroundMaterial:
        'https://type-level-typescript.com/template-literal-types',
      kind: 'background',
    },
    {
      name: 'Backend development',
      exerciseCount: 21,
      description: 'Typing the backend',
      requirements: ['nodejs', 'jest'],
      kind: 'special',
    },
  ]

  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0
  )

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  )
}

interface HeaderProps {
  name: string
}

const Header = ({ name }: HeaderProps) => <h1>{name}</h1>

interface ContentProps {
  courseParts: CoursePart[]
}

const Content = ({ courseParts }: ContentProps) => (
  <>
    {courseParts.map(part => (
      <Fragment>
        <p>
          <CoursePartHeader
            name={part.name}
            exerciseCount={part.exerciseCount}
          />
          <CoursePartBody {...part} />
        </p>
      </Fragment>
    ))}
  </>
)

const CoursePartHeader = ({ name, exerciseCount }: CoursePartBase) => (
  <header>
    <strong>
      {name} {exerciseCount}
    </strong>
  </header>
)

const CoursePartBody = (part: CoursePart) => {
  switch (part.kind) {
    case 'basic':
      return (
        <main>
          <i>{part.description}</i>
        </main>
      )
    case 'group':
      return <main>project exercises {part.groupProjectCount}</main>
    case 'background':
      return (
        <main>
          <div>
            <i>{part.description}</i>
          </div>
          submit to {part.backgroundMaterial}
        </main>
      )
    case 'special':
      return <main>required skills: {part.requirements.join(', ')}</main>
  }
}

interface TotalProps {
  totalExercises: number
}

const Total = ({ totalExercises }: TotalProps) => (
  <p>Number of exercises {totalExercises}</p>
)

export default App
