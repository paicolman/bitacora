import React from 'react'
import { Link } from "react-router-dom"
import { Navbar, Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'


export default function AppHeader({ logoutUser }) {
  const { logout } = useAuth()

  function handleLogout() {
    logout()
  }
  function setLink() {
    return logoutUser ? <button className='btn btn-link' onClick={handleLogout}>Log-out</button> : <Link to="/login">Log-in</Link>

  }

  return (
    <Navbar className='app-header sticky-top'>
      <Container>
        <Navbar.Brand><h1>BITACORA</h1></Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {setLink()}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
