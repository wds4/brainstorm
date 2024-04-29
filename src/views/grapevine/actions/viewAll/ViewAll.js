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
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { fetchFirstByTag } from '../../../../helpers'
import { SubmittedBy } from '../../components/submittedBy'

// eslint-disable-next-line react/prop-types
const ShowSingleItem = ({ event }) => {
  const [showDetailsElementClassName, setShowDetailsElementClassName] = useState('hide')
  const toggleShowDetails = useCallback(async () => {
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
  const name = fetchFirstByTag('name', event)
  const description = fetchFirstByTag('description', event)
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
        onClick={(e) => toggleShowDetails(e)}
        className="d-flex justify-content-between align-items-center"
      >
        <strong>{name}</strong>
      </CListGroupItem>
      <CCardBody className={showDetailsElementClassName}>
        <CCardBody>
          <small>{description}</small>
        </CCardBody>
        <SubmittedBy event={event} />
        <CCardBody className="d-flex justify-content-between align-items-right">
          <span>
            <small>editable:</small> <strong>{isEditable}</strong>
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
const ViewAllActions = () => {
  const oActions = useSelector((state) => state.grapevine.actions)
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>View all Actions ({Object.keys(oActions).length})</strong>
          </CCardHeader>
          <CCardBody>
            <CListGroup>
              {Object.keys(oActions).map((key, event) => {
                return <ShowSingleItem key={key} event={oActions[key]} />
              })}
            </CListGroup>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ViewAllActions
