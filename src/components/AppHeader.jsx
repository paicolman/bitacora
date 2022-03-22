import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { Navbar, Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'


export default function AppHeader({ props }) {
  const [links, setLinks] = useState()
  const { logout } = useAuth()

  useEffect(() => {
    setLinks(setLink())
  }, [])

  function handleLogout() {
    logout()
    window.location = '/login'
  }

  function handleHome() {
    window.location = '/'
  }

  function setLink() {
    console.log(props)
    let home = <></>
    let loginLogout = <></>
    if (props) {

      home = props.home ? <button className='btn btn-link' onClick={handleHome}>Home</button> : <></>
      loginLogout = props.logoutUser ? <button className='btn btn-link' onClick={handleLogout}>Log-out</button> : <Link to="/login">Log-in</Link>
    } else {
      loginLogout = <button className='btn btn-link' onClick={handleLogout}>Log-out</button>
    }
    return (
      <>
        {home}
        {loginLogout}
      </>
    )

  }

  return (
    <Navbar className='app-header sticky-top'>
      <Container>
        <Navbar.Brand><h1>BITACORA</h1></Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {links}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
