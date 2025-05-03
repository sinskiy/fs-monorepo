import { useState } from 'react'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleFeedbackClick = (type) => () => {
    switch (type) {
      case 'good':
        setGood((good) => good + 1)
        break
      case 'neutral':
        setNeutral((neutral) => neutral + 1)
        break
      case 'bad':
        setBad((bad) => bad + 1)
    }
  }

  return (
    <main>
      <section>
        <h2>give feedback</h2>
        <nav>
          <Button feedback="good" onFeedbackClick={handleFeedbackClick} />
          <Button feedback="neutral" onFeedbackClick={handleFeedbackClick} />
          <Button feedback="bad" onFeedbackClick={handleFeedbackClick} />
        </nav>
      </section>
      <section>
        <h2>statistics</h2>
        {good + neutral + bad === 0 ? (
          <p>No feedback given</p>
        ) : (
          <table>
            <tbody>
              <FeedbackStat text="good" value={good} />
              <FeedbackStat text="neutral" value={neutral} />
              <FeedbackStat text="bad" value={bad} />
              <FeedbackStat text="all" value={good + neutral + bad} />
              <FeedbackStat
                text="average"
                value={(good - bad) / (good + bad + neutral)}
              />
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}

export default App

const Button = ({ feedback, onFeedbackClick }) => (
  <button onClick={onFeedbackClick(feedback)}>{feedback}</button>
)

const FeedbackStat = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)
