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
import { useDispatch, useSelector } from 'react-redux'
import { fetchFirstByTag } from '../../../../helpers'
import { SubmittedBy } from '../../components/submittedBy'
import { Link } from 'react-router-dom'
import { updateViewContextId } from '../../../../redux/features/siteNavigation/slice'
import GrapevineListener from '../../helpers/listeners/GrapevineListener'

// eslint-disable-next-line react/prop-types
const ShowSingleItem = ({ contextId, event }) => {
  const dispatch = useDispatch()
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
  const updateViewContext = (newContextId) => {
    dispatch(updateViewContextId(newContextId))
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
        <Link
          onClick={() => updateViewContext(contextId)}
          to="/grapevine/contexts/viewSingle"
          style={{ float: 'right' }}
        >
          more info
        </Link>
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
          <div>contextId: {contextId}</div>
          <pre>{JSON.stringify(oWord, null, 4)}</pre>
          <pre>{JSON.stringify(event, null, 4)}</pre>
        </CCardBody>
      </CCardBody>
    </>
  )
}
const ViewAllContexts = () => {
  const oContexts = useSelector((state) => state.grapevine.contexts)
  return (
    <>
      <GrapevineListener />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>View all Contexts ({Object.keys(oContexts).length})</strong>
            </CCardHeader>
            <CCardBody>
              <CListGroup>
                {Object.keys(oContexts).map((key, event) => {
                  return (
                    <>
                      <ShowSingleItem key={key} contextId={key} event={oContexts[key]} />
                    </>
                  )
                })}
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>
        <Link to="/grapevine/contexts/makeNew">
          <CButton color="primary">create a new Context</CButton>
        </Link>
      </CRow>
    </>
  )
}

export default ViewAllContexts
