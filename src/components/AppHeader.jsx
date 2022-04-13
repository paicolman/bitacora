import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Container, Image } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

export default function AppHeader({ props }) {
  const [links, setLinks] = useState()
  const [goBack, setGoBack] = useState()
  const { logout } = useAuth()

  useEffect(() => {
    setLinks(setLink())
  }, [])

  function handleLogout() {
    logout()
    setGoBack(<Navigate to='/login' />)
  }

  function handleHome() {
    setGoBack(<Navigate to='/' />)
  }

  function setLink() {
    let home = <></>
    let loginLogout = <></>
    if (props) {

      home = props.home ? <button className='btn btn-link' onClick={handleHome}>Home</button> : <></>
      loginLogout = props.logoutUser ? <button className='btn btn-link' onClick={handleLogout}>Log-out</button> : <Link to='/login'>Log-in</Link>
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
    <>
      {goBack}
      <Navbar className='app-header sticky-top'>
        <Container>
          <Navbar.Brand><Image src='assets/bitacora_logo.png' className='app-logo' /></Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className='justify-content-end'>
            <Navbar.Text>
              {links}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}
