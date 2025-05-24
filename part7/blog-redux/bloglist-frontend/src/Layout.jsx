import { NavLink, Outlet } from 'react-router'
import Message from './components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './reducers/userReducer'
import blogService from './services/blogs'
import { useEffect, useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Link from '@mui/material/Link'

const Layout = () => {
  const dispatch = useDispatch()

  const username = useSelector(state => state.user?.username)

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = e => {
    e.preventDefault()

    dispatch(setUser(null))
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const [anchorElNav, setAnchorElNav] = useState(null)
  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget)
  }
  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                <MenuItem>
                  <Link to="/" component={NavLink}>
                    blogs
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/users" component={NavLink}>
                    users
                  </Link>
                </MenuItem>
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Link
                to="/"
                component={NavLink}
                sx={{ color: 'white', m: 2, display: 'block' }}
              >
                <Typography variant="button">blogs</Typography>
              </Link>
              <Link
                to="/users"
                component={NavLink}
                sx={{ color: 'white', m: 2, display: 'block' }}
              >
                <Typography variant="button">users</Typography>
              </Link>
            </Box>
            {username && (
              <Box
                sx={{
                  flexGrow: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Typography variant="body1" component="p">
                  {username} logged in
                </Typography>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleLogout}
                >
                  logout
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 2 }}>
          blog app
        </Typography>
        <Message />
        <Outlet />
      </Container>
    </>
  )
}

export default Layout
