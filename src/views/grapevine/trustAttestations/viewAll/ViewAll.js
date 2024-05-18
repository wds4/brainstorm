import React, { useCallback, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormSwitch,
  CListGroupItem,
  CListGroup,
  CButton,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { fetchFirstByTag } from '../../../../helpers'
import { SubmittedBy } from '../../components/submittedBy'
import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilThumbDown, cilThumbUp } from '@coreui/icons'
import { Ratee } from '../../components/Ratee'
import { ShowContext } from './ShowContext'
import GrapevineListener from 'src/helpers/listeners/GrapevineListener'

const DisplayScore = ({ score }) => {
  if (score == '0') {
    return <CIcon style={{ color: 'red' }} icon={cilThumbDown} />
  }
  if (score == '100') {
    return <CIcon style={{ color: 'green' }} icon={cilThumbUp} />
  }
  return <>{score}</>
}

// eslint-disable-next-line react/prop-types
const ShowSingleItem = ({ trustAttestationId, event }) => {
  const [showDetailsElementClassName, setShowDetailsElementClassName] = useState('hide')
  const toggleShowDetails = useCallback(async (e) => {
    console.log('toggleShowDetails: ' + e.target.value)
    if (showDetailsElementClassName == 'hide') {
      setShowDetailsElementClassName('show')
    }
    if (showDetailsElementClassName == 'show') {
      setShowDetailsElementClassName('hide')
    }
  }, [showDetailsElementClassName])
  const [showRawElementClassName, setShowRawElementClassName] = useState('hide')
  const toggleShowRaw = (e) => {
    const currentState = e.target.dataset.state
    if (currentState == 'closed') {
      e.target.dataset.state = 'open'
      setShowRawElementClassName('show')
    }
    if (currentState == 'open') {
      e.target.dataset.state = 'closed'
      setShowRawElementClassName('hide')
    }
  }
  const contextId = fetchFirstByTag('c', event)
  const score = fetchFirstByTag('score', event)
  const comments = event.content
  let oWord = {}
  try {
    const sWord = fetchFirstByTag('word', event)
    oWord = JSON.parse(sWord)
  } catch (e) {
    console.log(e)
  }
  let isEditable = 'not editable'
  if (event.kind == 39902) {
    isEditable = 'editable'
  }
  return (
    <>
      <CListGroupItem
        key={event.id}
        as="a"
        // onClick={(e) => toggleShowDetails(e)}
        className="d-flex justify-content-between align-items-center"
      >
        <DisplayScore score={score} />
        <Ratee event={event} />
        <CButton onClick={(e) => toggleShowDetails(e)}>view details</CButton>
      </CListGroupItem>
      <CCardBody className={showDetailsElementClassName}>
        <ShowContext contextId={contextId} event={event} />
        <CCardBody>
          <small style={{ textDecoration: 'underline' }}>Comments:</small>
          <br />
          <large>{comments}</large>
        </CCardBody>
        <SubmittedBy event={event} />
        <CCardBody className="d-flex justify-content-between align-items-right">
          <span>
            <small style={{ textDecoration: 'underline' }}>editable:</small>{' '}
            <strong>{isEditable}</strong>
          </span>
          <CFormSwitch
            style={{ textAlign: 'right' }}
            onChange={(e) => toggleShowRaw(e)}
            value={event.id}
            data-state="closed"
            label="raw"
            id="formSwitchCheckDefault"
          />
        </CCardBody>
        <CCardBody className={showRawElementClassName}>
          <pre>{JSON.stringify(oWord, null, 4)}</pre>
          <pre>{JSON.stringify(event, null, 4)}</pre>
        </CCardBody>
      </CCardBody>
    </>
  )
}
const ViewAllTrustAttestations = () => {
  const oTrustAttestations = useSelector((state) => state.grapevine.trustAttestations)
  return (
    <>
      <GrapevineListener />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>
                View all Trust Attestations ({Object.keys(oTrustAttestations).length})
              </strong>
            </CCardHeader>
            <CCardBody>
              <CListGroup>
                {Object.keys(oTrustAttestations).map((key, event) => {
                  return (
                    <ShowSingleItem
                      key={key}
                      trustAttestationId={key}
                      event={oTrustAttestations[key]}
                    />
                  )
                })}
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>
        <Link to="/grapevine/trustAttestations/makeNew">
          <CButton color="primary">create a new Trust Attestation</CButton>
        </Link>
      </CRow>
    </>
  )
}

export default ViewAllTrustAttestations
