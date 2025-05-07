import { useEffect } from 'react'
import { useState } from 'react'

const baseApiUrl = 'https://studies.cs.helsinki.fi/restcountries/api'
const baseWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${
  import.meta.env.VITE_WEATHER_API_KEY
}`
const baseWeatherIconUrl = 'https://openweathermap.org/img/wn'

const App = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch(`${baseApiUrl}/all`)
      .then(response => response.json())
      .then(json => setData(json))
  }, [])

  const [results, setResults] = useState(null)

  const handleSearch = e => {
    const search = e.currentTarget.value
    setResults(
      data.filter(country =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )
    )
  }

  const [shown, setShown] = useState({})
  const [weather, setWeather] = useState({})

  const handleToggleInfoClick = (id, capital) => {
    if (shown[id]) {
      setShown({ ...shown, [id]: false })
    } else {
      setShown({ ...shown, [id]: true })
      const [lat, lon] = capital.coords
      fetch(`${baseWeatherApiUrl}&lat=${lat}&lon=${lon}`)
        .then(result => result.json())
        .then(json =>
          setWeather({
            ...weather,
            [capital.name]: {
              temperature: json.main.temp,
              wind: json.wind.speed,
              icon: json.weather[0].icon,
              description: json.weather[0].description,
            },
          })
        )
    }
  }

  if (!data) return

  return (
    <main>
      <nav>
        <search>
          <form onSubmit={e => e.preventDefault()}>
            <label htmlFor="search">find countries</label>
            <input
              type="text"
              name="search"
              id="search"
              onChange={handleSearch}
            />
          </form>
        </search>
      </nav>
      {results &&
        (results.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : (
          <ul style={{ padding: 0, listStyleType: 'none' }}>
            {results.map(result => (
              <li key={result.cca2}>
                {shown[result.cca2] ? (
                  <>
                    <h2 style={{ fontSize: '2rem' }}>{result.name.common}</h2>
                    <p>Capital {result.capital}</p>
                    <p>Area {result.area}</p>
                    <h3 style={{ fontSize: '1.5rem' }}>Languages</h3>
                    <ul style={{ listStyleType: 'disc' }}>
                      {Object.entries(result.languages).map(
                        ([key, language]) => (
                          <li key={key}>{language}</li>
                        )
                      )}
                    </ul>
                    <img
                      style={{ marginTop: 16 }}
                      width={256}
                      height={128}
                      src={result.flags.svg}
                      alt={result.flags.alt}
                    />
                    {weather[result.capital[0]] && (
                      <>
                        <h3 style={{ fontSize: '1.5rem' }}>
                          Weather in {result.capital}
                        </h3>
                        <p>
                          Temperature {weather[result.capital[0]].temperature}{' '}
                          Celcius
                        </p>
                        <img
                          src={`${baseWeatherIconUrl}/${
                            weather[result.capital[0]].icon
                          }@2x.png`}
                          alt={`${weather[result.capital[0]].description}`}
                        />
                        <p>Wind {weather[result.capital[0]].temperature} m/s</p>
                      </>
                    )}
                  </>
                ) : (
                  result.name.common
                )}
                <button
                  onClick={() =>
                    handleToggleInfoClick(result.cca2, {
                      name: result.capital[0],
                      coords: result.capitalInfo.latlng,
                    })
                  }
                >
                  {shown[result.cca2] ? 'hide' : 'show'}
                </button>
              </li>
            ))}
          </ul>
        ))}
    </main>
  )
}

export default App
