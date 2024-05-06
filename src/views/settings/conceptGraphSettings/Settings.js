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
  CContainer,
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { signEventPGA } from '../../../helpers/signers'
import { fetchFirstByTag } from '../../../helpers'
import { useNostr } from 'nostr-react'

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
          <strong>
            raw JSON, word type: conceptGraphSettings, tapestry protocol (experimental)
          </strong>
        </CCardHeader>
        <CCardBody>
          <pre>{JSON.stringify(oWord, null, 4)}</pre>
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
    ['wordType', 'conceptGraphSettings'],
    ['w', 'conceptGraphSettings'],
    ['d', 'conceptGraphSettings'],
  ],
  created_at: null,
}

async function makeWord(oProfile, personalRelay) {
  const oWord = {
    conceptGraphSettingsData: {
      personalRelay: personalRelay,
    },
  }
  const sWord = JSON.stringify(oWord)
  const oEvent = oEventDefault
  oEvent.content = ''
  oEvent.kind = 39902
  const tags = [
    ['P', 'tapestry'],
    ['word', sWord],
    ['wordType', 'conceptGraphSettings'],
    ['w', 'conceptGraphSettings'],
    ['d', 'conceptGraphSettings'],
  ]
  oEvent.tags = tags
  oEvent.created_at = Math.floor(Date.now() / 1000)
  const oEvent_signed = await signEventPGA(oProfile, oEvent)
  return oEvent_signed
}

const ConceptGraphSettings = () => {
  const oProfile = useSelector((state) => state.profile)
  const currentPersonalRelay = useSelector((state) => state.settings.conceptGraph.personalRelay)
  const [showRawDataButton, setShowRawDataButton] = useState('hide')
  const [personalRelay, setPersonalRelay] = useState('')
  const [oEvent, setOEvent] = useState(oEventDefault)
  const [updateRelaySuccessClassName, setUpdateRelaySuccessClassName] = useState('hide')

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
  const handlePersonalRelayChange = useCallback(
    async (e) => {
      const newPersonalRelay = e.target.value
      setPersonalRelay(newPersonalRelay)
      const oEvent = await makeWord(oProfile, newPersonalRelay)
      setOEvent(oEvent)
      setUpdateRelaySuccessClassName('hide')
    },
    [oEvent, personalRelay],
  )
  const { publish } = useNostr()

  const publishUpdatedConceptGraphSettings = useCallback(async () => {
    publish(oEvent)
    setUpdateRelaySuccessClassName('show')
    setPersonalRelay('')
  }, [oEvent])
  return (
    <>
      <center>
        <h4>Concept Graph Settings</h4>
      </center>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Personal Relay</strong>{' '}
              <small>
                (use of personal relay is not yet implemented -- need to check if replaceable events
                is supported?)
              </small>
            </CCardHeader>
            <CCardBody>
              <CContainer>
                current personal relay: <strong>{currentPersonalRelay}</strong>
              </CContainer>
              <br />
              <CContainer>
                <p>
                  During the initial development phase of the concept graph, the protocols and data
                  formats of words and events will likely change quite often. To prevent spamming
                  public relays with large quantities of improperly formatted data during this
                  development phase, your Concept Graph will be stored on a personal relay. The only
                  data that will be stored on public relays will be your Concept Graph Settings
                  (should this file be encrypted?). This will prevent you from having to retype your
                  personal relay every time you wish to access your Concept Graph.
                </p>
                <p>
                  Once data formats are sufficiently established, you will have the option to store
                  some or all of your Concept Graph on public relays. We anticipate the eventual
                  development of dedicated relays for storage of concept graph data, possibly
                  available as a subscription service.
                </p>
              </CContainer>
              <br />
              <CContainer>
                <CForm>
                  <CFormInput
                    type="text"
                    label="Input your personal relay:"
                    placeholder="wss://..."
                    required
                    value={personalRelay}
                    onChange={handlePersonalRelayChange}
                  />
                </CForm>
              </CContainer>
              <CContainer className={updateRelaySuccessClassName}>
                <br />
                Your relay has been updated!
              </CContainer>
              <CContainer>
                <CButton
                  color="primary"
                  className="mt-3"
                  onClick={publishUpdatedConceptGraphSettings}
                >
                  Submit
                </CButton>
              </CContainer>
            </CCardBody>
          </CCard>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'inline-block' }}>
              <CFormSwitch
                onChange={(e) => toggleShowRawData(e)}
                label="raw JSON with concept graph settings data"
              />
            </div>
          </div>
          <RawData showRawDataButton={showRawDataButton} oEvent={oEvent} />
        </CCol>
      </CRow>
    </>
  )
}

export default ConceptGraphSettings
