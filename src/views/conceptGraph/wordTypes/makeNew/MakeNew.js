import React, { useCallback, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormTextarea,
  CCardTitle,
  CFormInput,
  CFormSwitch,
} from '@coreui/react'
import { signEventPGA } from 'src/helpers/signers'
import { useSelector } from 'react-redux'
import { useNostr } from 'nostr-react'
import { fetchFirstByTag } from '../../../../helpers'

const oEventDefault = {
  content: '',
  kind: 39902,
  tags: [
    ['P', 'tapestry'],
    ['word', '{}'],
    ['wordType', 'wordType'],
    ['w', 'wordType'],
    ['nameSingular', ''],
    ['namePlural', ''],
    ['description', ''],
    ['d', 'wordType_'],
  ],
  created_at: null,
}

async function makeWord(oProfile, nameSingular, namePlural, description) {
  const path = nameSingular + 'Data'
  const oWord = {
    wordTypeData: {
      name: {
        singular: nameSingular,
        plural: namePlural,
      },
      description: description,
      path: path,
    },
  }
  const sWord = JSON.stringify(oWord)
  const oEvent = oEventDefault
  oEvent.content = ''
  oEvent.kind = 39902
  const tags = [
    ['P', 'tapestry'],
    ['word', sWord],
    ['wordType', 'wordType'],
    ['w', 'wordType'],
    ['nameSingular', nameSingular],
    ['namePlural', namePlural],
    ['description', description],
    ['d', 'wordType_' + nameSingular],
  ]
  oEvent.tags = tags
  oEvent.created_at = Math.floor(Date.now() / 1000)
  const oEvent_signed = await signEventPGA(oProfile, oEvent)
  return oEvent_signed
}

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
          <strong>raw JSON, word type: wordType, tapestry protocol (experimental)</strong>
        </CCardHeader>
        <CCardBody>
          <pre>{JSON.stringify(oWord, null, 4)}</pre>
          <pre>{JSON.stringify(oEvent, null, 4)}</pre>
        </CCardBody>
      </CCard>
    </>
  )
}

const MakeNewWordType = () => {
  const oProfile = useSelector((state) => state.profile)
  const [nameSingular, setNameSingular] = useState('')
  const [namePlural, setNamePlural] = useState('')
  const [description, setDescription] = useState('')
  const [oEvent, setOEvent] = useState(oEventDefault)
  const [showRawDataButton, setShowRawDataButton] = useState('hide')
  const [submitEventButtonClassName, setSubmitEventButtonClassName] = useState('mt-3')
  const [createAnotherElementClassName, setCreateAnotherElementClassName] = useState('hide')

  const { publish } = useNostr()

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

  const publishWordType = useCallback(async () => {
    const note = {}
    note.kind = 1
    note.content = ''
    note.tags = []
    note.created_at = Math.floor(Date.now() / 1000)
    const note_signed = await signEventPGA(oProfile, note)
    // publish(note_signed)
    setSubmitEventButtonClassName('hide')
    setCreateAnotherElementClassName('show')
  }, [nameSingular, namePlural, description])

  const clearFields = useCallback(async (e) => {
    setNameSingular('')
    setNamePlural('')
    setDescription('')
    const oEvent = await makeWord(oProfile, '', '', '')
    setOEvent(oEvent)
  }, [])

  const handleNameSingularChange = useCallback(
    async (e) => {
      const newNameSingular = e.target.value
      setNameSingular(newNameSingular)
      const oEvent = await makeWord(oProfile, newNameSingular, namePlural, description)
      setOEvent(oEvent)
    },
    [nameSingular, namePlural, description],
  )

  const handleNamePluralChange = useCallback(
    async (e) => {
      const newNamePlural = e.target.value
      setNamePlural(newNamePlural)
      const oEvent = await makeWord(oProfile, nameSingular, newNamePlural, description)
      setOEvent(oEvent)
    },
    [nameSingular, namePlural, description],
  )

  const handleDescriptionChange = useCallback(
    async (e) => {
      const newDescription = e.target.value
      setDescription(newDescription)
      const oEvent = await makeWord(oProfile, nameSingular, namePlural, newDescription)
      setOEvent(oEvent)
    },
    [nameSingular, namePlural, description],
  )

  const createAnotherWordTypeButton = useCallback(() => {
    setSubmitEventButtonClassName('mt-3')
    setCreateAnotherElementClassName('hide')
    clearFields()
  }, [nameSingular, namePlural, description])
  return (
    <>
      <center>
        <h3>Make New Word Type</h3>
        <small>page not yet functional</small>
      </center>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Make New Word Type</strong>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CFormInput
                  label="name (singular)"
                  type="text"
                  value={nameSingular}
                  onChange={handleNameSingularChange}
                />
                <br />
                <CFormInput
                  label="name (plural)"
                  type="text"
                  value={namePlural}
                  onChange={handleNamePluralChange}
                />
                <br />
                <CFormTextarea
                  label="description"
                  type="text"
                  value={description}
                  onChange={handleDescriptionChange}
                />
              </CForm>
              <CButton
                color="primary"
                className={submitEventButtonClassName}
                onClick={publishWordType}
              >
                Submit
              </CButton>
              <div className={createAnotherElementClassName}>
                <br />
                <CCardTitle>Your word type has been recorded!</CCardTitle>
                <CButton
                  color="primary"
                  id="createAnotherEventButton"
                  onClick={createAnotherWordTypeButton}
                >
                  Create another word type
                </CButton>
              </div>
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

export default MakeNewWordType
