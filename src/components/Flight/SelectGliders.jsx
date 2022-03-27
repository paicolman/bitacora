import React, { useState, useContext, useEffect } from 'react'
import { ProfileDataContext } from '../../contexts/ProfileDataContext'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import { Card, Row, Col, Form, Image } from 'react-bootstrap'
import { FlightContext } from '../../contexts/FlightContext'

export default function SelectGliders({ gliderIdFromDB }) {
  const { getProfileData } = useContext(ProfileDataContext)
  const { setSelectedGlider } = useContext(FlightContext)
  const [dataReady, setDataReady] = useState(false)
  const [gliders, setgliders] = useState(null)
  const [activeGlider, setActiveGlider] = useState({ type: '', model: '', nickname: '' })
  const [gliderpic, setGliderpic] = useState(null)
  const [switched, setSwitched] = useState(false)

  useEffect(() => {
    if (!dataReady) {
      getDataFromDb()
    }
  }, [])

  async function getDataFromDb() {
    const data = await getProfileData('/profile/gliders')
    setgliders(data)
    setDataReady(true)
  }

  function switchGlider(e) {

    const selected = gliders.filter(glider => {
      console.log(e.target.value)
      return glider.id === e.target.value
    })
    getPicUrl(selected[0].id)
    setActiveGlider(selected[0])
    setSwitched(true)
    setSelectedGlider(selected[0])
  }

  function getPicUrl(gliderId) {
    const storage = getStorage()
    const storageRef = ref(storage, `${gliderId}/images/thumbnail`)
    getDownloadURL(storageRef, `${gliderId}/images/thumbnail`).then((url) => {
      setGliderpic(url)
    }, () => {
      setGliderpic('assets/nopic.jpg')
    })
  }

  function listGliders() {
    if (dataReady) {
      let defOption = ''
      let defaultGlider = {}
      let options = gliders?.map((glider, idx) => {
        let optionText = glider.nickname ? glider.nickname : glider.model
        optionText = `Your Glider: ${optionText}`
        const optionValue = glider.id
        if (glider.default) {
          defOption = glider.id
          defaultGlider = glider
        }
        //Overrule glider.default if there is a gliderId from the DB
        if (glider.id === gliderIdFromDB) {
          defOption = gliderIdFromDB
          defaultGlider = glider
        }
        return <option key={`opt-${idx}`} value={optionValue} >{optionText}</option>
      })
      if (options === undefined) {
        options = <option key={'opt-00'} value='no-glider' >No glider available</option>
      }
      if ((activeGlider.model !== defaultGlider.model) && (!switched)) {
        getPicUrl(defaultGlider.id)
        setActiveGlider({
          type: defaultGlider.type,
          model: defaultGlider.model,
          nickname: defaultGlider.nickname
        })
        if (Object.keys(defaultGlider).length === 0) {
          console.log('no gliders selected')
          setSelectedGlider({
            id: '',
            type: '',
            model: '',
            nickname: ''
          })
        } else {
          setSelectedGlider(defaultGlider)
        }
      }

      return (
        <>
          <Form.Select defaultValue={defOption} onChange={switchGlider} size="sm">
            {options}
          </Form.Select>
          <Card className='mt-1'>
            <Card.Body className='pt-1 pb-1'>
              <Row>
                <Col sm>
                  <h5>{activeGlider.type}</h5>
                  <h6>{activeGlider.model}</h6>
                  <h6>{activeGlider.nickname}</h6>
                </Col>
                <Col sm className='text-center'>
                  <Image src={gliderpic} style={{ maxWidth: '100%', maxHeight: '100px' }} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </>

      )
    } else {
      return <div>No gliders...</div>
    }
  }

  return (
    <>
      {listGliders()}
    </>
  )
}