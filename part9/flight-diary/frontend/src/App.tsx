import { useEffect, useState, type FormEventHandler } from 'react'
import { type DiaryEntry } from './types'
import { createDiaryEntry, getAllDiaryEntries } from './diaryService'
import { getErrorMessage } from './utils'

function App() {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    getAllDiaryEntries()
      .then(value => {
        setDiaryEntries(value)
        setError('')
      })
      .catch(error => {
        setError(getErrorMessage(error))
      })
  }, [])

  const handleDiaryEntrySubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    createDiaryEntry({
      date: formData.get('date'),
      visibility: formData.get('visibility'),
      weather: formData.get('weather'),
      comment: formData.get('comment'),
    })
      .then(createdDiaryEntry => {
        setDiaryEntries([...diaryEntries, createdDiaryEntry])
        setError('')
      })
      .catch(error => {
        setError(getErrorMessage(error))
      })
  }

  return (
    <main>
      <section>
        <h2>Add new entry</h2>
        <form onSubmit={handleDiaryEntrySubmit}>
          <p aria-live="polite" style={{ color: 'red' }}>
            {error}
          </p>
          <div>
            <label htmlFor="date">date</label>
            <input type="date" name="date" id="date" />
          </div>
          <div>
            visibility
            <label htmlFor="great">great</label>
            <input type="radio" name="visibility" id="great" value="great" />
            <label htmlFor="good">good</label>
            <input type="radio" name="visibility" id="good" value="good" />
            <label htmlFor="ok">ok</label>
            <input type="radio" name="visibility" id="ok" value="ok" />
            <label htmlFor="poor">poor</label>
            <input type="radio" name="visibility" id="poor" value="poort" />
          </div>
          <div>
            weather
            <label htmlFor="sunny">sunny</label>
            <input type="radio" name="weather" id="sunny" value="sunny" />
            <label htmlFor="rainy">rainy</label>
            <input type="radio" name="weather" id="rainy" value="rainy" />
            <label htmlFor="cloudy">cloudy</label>
            <input type="radio" name="weather" id="cloudy" value="cloudy" />
            <label htmlFor="stormy">stormy</label>
            <input type="radio" name="weather" id="stormy" value="stormy" />
            <label htmlFor="windy">windy</label>
            <input type="radio" name="weather" id="windy" value="windy" />
          </div>
          <div>
            <label htmlFor="comment">comment</label>
            <input type="text" name="comment" id="comment" />
          </div>
          <button type="submit">add</button>
        </form>
      </section>
      <section>
        <h2>Diary entries</h2>
        {diaryEntries.length ? (
          diaryEntries.map(entry => (
            <article key={entry.id}>
              <p>
                <b>
                  <time dateTime={new Date(entry.date).toISOString()}>
                    {entry.date}
                  </time>
                </b>
              </p>
              <p>
                visibility: {entry.visibility}
                <br />
                weather: {entry.weather}
              </p>
            </article>
          ))
        ) : (
          <p>no diary entries yet</p>
        )}
      </section>
    </main>
  )
}

export default App
