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
import { ndk } from '../../../helpers/ndk'
import RawData from './RawData'
///////////////
import { NDKEvent, NDKKind, NDKNip07Signer } from '@nostr-dev-kit/ndk'

const PublishNoteNdk = () => {
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
  // const { publish } = useNostr()

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

  const publishNote = async () => {
    const nip07signer = new NDKNip07Signer()
    // const ndkEvent = new NDKEvent(ndk, { kind: NDKKind.Metadata })
    const ndkEvent = new NDKEvent(ndk)

    ndkEvent.kind = 1
    ndkEvent.content = content
    console.log('publishNote; content: ' + content)
    await ndkEvent.sign(nip07signer)
    await ndkEvent.publish() // This will trigger the extension to ask the user to confirm signing.
  }

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
        <h3>Publish kind 1 Note: NDK</h3>
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
                onClick={publishNote}
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
        </CCol>
        <CCol>
          <CFormSwitch onChange={(e) => toggleShowRawData(e)} label="raw JSON" />
          <br />
          <RawData showRawDataButton={showRawDataButton} oEvent={oEvent} />
        </CCol>
      </CRow>
    </>
  )
}

export default PublishNoteNdk
