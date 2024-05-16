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
  CFormSwitch,
} from '@coreui/react'
import { signEventPGA } from 'src/helpers/signers'
import { useSelector } from 'react-redux'
import { useNostr } from 'nostr-react'
import RawData from './RawData'

const PublishNote = () => {
  const signedIn = useSelector((state) => state.profile.signedIn)
  const oProfile = useSelector((state) => state.profile)
  const [content, setContent] = useState('')
  const [submitEventButtonClassName, setSubmitEventButtonClassName] = useState('mt-3')
  const [createAnotherElementClassName, setCreateAnotherElementClassName] = useState('hide')
  const [oEvent, setOEvent] = useState({})
  const [showRawDataButton, setShowRawDataButton] = useState('hide')

  const handleContentChange = useCallback(
    async (e) => {
      const newContent = e.target.value
      setContent(newContent)
      previewTwittrNote(newContent)
    },
    [content],
  )
  const { publish } = useNostr()

  const previewTwittrNote = useCallback(
    async (newContent) => {
      const note = {}
      note.kind = 1
      note.content = newContent
      note.tags = []
      note.created_at = Math.floor(Date.now() / 1000)
      const note_signed = await signEventPGA(oProfile, note)
      setOEvent(note_signed)
    },
    [content],
  )

  const publishTwittrNote = useCallback(async () => {
    const note = {}
    note.kind = 1
    note.content = content
    note.tags = []
    note.created_at = Math.floor(Date.now() / 1000)
    const note_signed = await signEventPGA(oProfile, note)
    publish(note_signed)
    setOEvent(note_signed)
    setSubmitEventButtonClassName('hide')
    setCreateAnotherElementClassName('show')
  }, [content])

  const createAnotherNoteButton = useCallback(() => {
    setSubmitEventButtonClassName('mt-3')
    setCreateAnotherElementClassName('hide')
    setContent('')
  }, [content])
  if (!signedIn) {
    return (
      <>
        <div>You must be logged in to post a note.</div>
      </>
    )
  }
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
  return (
    <>
      <center>
        <h3>Publish kind 1 Note</h3>
      </center>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Make New Note</strong>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CFormTextarea
                  type="text"
                  rows={3}
                  value={content}
                  onChange={handleContentChange}
                />
              </CForm>
              <CButton
                color="primary"
                className={submitEventButtonClassName}
                onClick={publishTwittrNote}
              >
                Submit
              </CButton>
              <div className={createAnotherElementClassName}>
                <br />
                <CCardTitle>Your note has been published!</CCardTitle>
                <CButton
                  color="primary"
                  id="createAnotherEventButton"
                  onClick={createAnotherNoteButton}
                >
                  Create another note
                </CButton>
              </div>
            </CCardBody>
          </CCard>
          <CFormSwitch onChange={(e) => toggleShowRawData(e)} label="raw JSON" />
          <RawData showRawDataButton={showRawDataButton} oEvent={oEvent} />
        </CCol>
      </CRow>
    </>
  )
}

export default PublishNote
