import { render } from '@testing-library/react'
import React from 'react'
import { Badge, Card, ListGroup } from 'react-bootstrap'
import EditMainData from './EditMainData'
import { AuthProvider } from '../../contexts/AuthContext';
import { ProfileDataProvider } from '../../contexts/ProfileDataContext'

export default function ShowMainData({ profileData }) {

  function licenseList() {
    const retVal = profileData?.licenses?.map((license, idx) => {
      return <ListGroup.Item key={`lic-${idx}`}>{license.id}</ListGroup.Item>
    })

    return retVal
  }

  function handlecloseDlg() {
    console.log('Wau Wau')
  }

  function handleChangeMainData(e) {
    const props = {
      data: profileData?.mainData,
      closeDlg: handlecloseDlg
    }
    render(
      <AuthProvider>
        <ProfileDataProvider>
          <EditMainData props={props} />
        </ProfileDataProvider>
      </AuthProvider>
    )
  }


  function handleChangeLicenses(e) {
    console.log('Na so was...')
  }

  return (
    <Card className='profile-container text-center'>
      <Card.Header><h1>{profileData?.mainData?.pilotName}</h1></Card.Header>
      <Card.Subtitle className='pt-2'>
        <h2>Flying since: {profileData?.mainData?.flyingSince}</h2>
        <Badge pill bg="primary" onClick={handleChangeMainData}>
          Change this
        </Badge>
      </Card.Subtitle>
      <Card.Body className='text-center licenses-container'>
        <Card className='licenses-card'>
          <Card.Header>Licenses</Card.Header>
          <ListGroup variant="flush" >
            {licenseList()}
          </ListGroup>
        </Card>
        <Badge pill bg="primary" onClick={handleChangeLicenses}>
          Change this
        </Badge>
      </Card.Body>
    </Card>
  )
}
