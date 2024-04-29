import React, { useCallback, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormInput,
  CFormSwitch,
  CFormTextarea,
  CCardTitle,
} from '@coreui/react'
import { dateToUnix, useNostr } from 'nostr-react'
import { fetchFirstByTag } from '../../../../helpers'
import { signEventPGA } from '../../../../helpers/signers'
import { useSelector } from 'react-redux'

// eslint-disable-next-line react/prop-types
const RawData = ({ showRawDataButton, oEvent }) => {
  if (showRawDataButton == 'hide') {
    return <></>
  }
  const sWord = fetchFirstByTag('word', oEvent)
  const oWord = JSON.parse(sWord)
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>raw tapestry word</strong>
        </CCardHeader>
        <CCardBody>
          <pre>{JSON.stringify(oWord, null, 4)}</pre>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>raw nostr event</strong>
        </CCardHeader>
        <CCardBody>
          <pre>{JSON.stringify(oEvent, null, 4)}</pre>
        </CCardBody>
      </CCard>
    </>
  )
}

const oEventDefault = {
  content: '',
  kind: 39902,
  tags: [
    ['P', 'tapestry'],
    ['word', '{}'],
    ['wordType', 'action'],
    ['w', 'action'],
    ['name', ''],
    ['description', ''],
    ['d', 'action:' + ''],
  ],
  created_at: null,
}

async function makeWord(oProfile, name, description, makeEditable) {
  const oWord = {
    actionData: {
      name: name,
      description: description,
    },
  }
  const sWord = JSON.stringify(oWord)
  let oEvent = oEventDefault
  oEvent.kind = 39902
  if (!makeEditable) {
    oEvent.kind = 9902
  }
  const tags = [
    ['P', 'tapestry'],
    ['word', sWord],
    ['wordType', 'action'],
    ['w', 'action'],
    ['name', name],
    ['description', description],
    ['d', 'action:' + name],
  ]
  oEvent.tags = tags
  oEvent.created_at = dateToUnix()
  // const oEvent_signed = await window.nostr.signEvent(oEvent)
  const oEvent_signed = await signEventPGA(oProfile, oEvent)
  return oEvent_signed
}

const MakeNewAction = () => {
  const oProfile = useSelector((state) => state.profile)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [makeEditable, setMakeEditable] = useState(true)
  const [oEvent, setOEvent] = useState(oEventDefault)
  const [showRawDataButton, setShowRawDataButton] = useState('hide')
  const [submitEventButtonClassName, setSubmitEventButtonClassName] = useState('mt-3')
  const [createAnotherElementClassName, setCreateAnotherElementClassName] = useState('hide')

  const { publish } = useNostr()
  const publishNewEvent = useCallback(async () => {
    publish(oEvent)
    setSubmitEventButtonClassName('hide')
    setCreateAnotherElementClassName('show')
  }, [name, description, oEvent])
  const createAnotherActionButton = useCallback(() => {
    setSubmitEventButtonClassName('mt-3')
    setCreateAnotherElementClassName('hide')
    clearFields()
  }, [name, description, oEvent])
  const handleNameChange = useCallback(
    async (e) => {
      const newName = e.target.value
      setName(newName)
      const oEvent = await makeWord(oProfile, newName, description, makeEditable)
      setOEvent(oEvent)
    },
    [name],
  )
  const handleDescriptionChange = useCallback(
    async (e) => {
      const newDescription = e.target.value
      setDescription(newDescription)
      const oEvent = await makeWord(oProfile, name, newDescription, makeEditable)
      setOEvent(oEvent)
    },
    [description],
  )
  const toggleMakeEditable = useCallback(
    async (e) => {
      const foo = e.target.value
      console.log('toggleMakeEditable: ' + foo)
      if (makeEditable) {
        setMakeEditable(false)
      } else {
        setMakeEditable(true)
      }
      const oEvent = await makeWord(oProfile, name, description, !makeEditable)
      setOEvent(oEvent)
    },
    [makeEditable],
  )
  const toggleShowRawData = useCallback(
    (e) => {
      if (showRawDataButton == 'hide') {
        setShowRawDataButton('show')
      }
      if (showRawDataButton == 'show') {
        setShowRawDataButton('hide')
      }
    },
    [showRawDataButton],
  )
  const clearFields = useCallback(async (e) => {
    setName('')
    setDescription('')
    setMakeEditable(true)
    const oEvent = await makeWord(oProfile, '', '', true)
    setOEvent(oEvent)
  }, [])
  let makeEditableState = 'NO'
  if (makeEditable) {
    makeEditableState = 'YES'
  }
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Make New Action</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CFormInput
                type="text"
                id="name"
                label="name"
                placeholder="to curate nostr content"
                required
                value={name}
                onChange={handleNameChange}
              />
              <br />
              <CFormTextarea
                type="text"
                id="description"
                rows={3}
                label="description"
                placeholder="lorem ipsum"
                value={description}
                onChange={handleDescriptionChange}
              />
              <br />
              <div>
                <div style={{ display: 'inline-block' }}>
                  <CFormSwitch
                    onChange={(e) => toggleMakeEditable(e)}
                    label="make editable?"
                    active
                    checked={makeEditable}
                  />
                </div>{' '}
                <strong>{makeEditableState}</strong>
              </div>
            </CForm>
            <CButton
              color="primary"
              className={submitEventButtonClassName}
              id="submitEventButton"
              active
              tabIndex={-1}
              onClick={publishNewEvent}
            >
              Submit
            </CButton>
            <div className={createAnotherElementClassName}>
              <br />
              <CCardTitle>Your action has been published!</CCardTitle>
              <CButton
                color="primary"
                id="createAnotherEventButton"
                onClick={createAnotherActionButton}
              >
                Create another action
              </CButton>
            </div>
          </CCardBody>
        </CCard>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'inline-block' }}>
            <CFormSwitch
              onChange={(e) => toggleShowRawData(e)}
              label="raw JSON"
              id="formSwitchCheckDefault"
            />
          </div>
        </div>
        <RawData showRawDataButton={showRawDataButton} oEvent={oEvent} />
      </CCol>
    </CRow>
  )
}

export default MakeNewAction
