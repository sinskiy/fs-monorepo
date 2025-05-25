import { Link, Outlet } from 'react-router'

const App = () => {
  return (
    <div>
      <div>
        <Link to="/authors">authors</Link>
        <Link to="/books">books</Link>
        <Link to="/add">add book</Link>
      </div>
      <Outlet />
    </div>
  )
}

export default App
