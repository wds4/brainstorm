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
import { useNDK } from '@nostr-dev-kit/ndk-react'
import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk'
import { signEventPGA } from '../../../helpers/signers'
import { useSelector } from 'react-redux'
import { aDefaultRelays } from '../../../const'
import { useNostr } from 'nostr-react'

const PublishNote = () => {
  const oProfile = useSelector((state) => state.profile)
  const [content, setContent] = useState('')
  const [submitEventButtonClassName, setSubmitEventButtonClassName] = useState('mt-3')
  const [createAnotherElementClassName, setCreateAnotherElementClassName] = useState('hide')

  const { signPublishEvent } = useNDK()
  const nip07signer = new NDKNip07Signer()
  const ndk = new NDK({ signer: nip07signer, explicitRelayUrls: aDefaultRelays })

  const handleContentChange = useCallback(
    async (e) => {
      const newContent = e.target.value
      setContent(newContent)
    },
    [content],
  )
  const { publish } = useNostr()

  const publishTwittrNote = useCallback(async () => {
    const note = {}
    note.kind = 1
    note.content = content
    note.tags = []
    note.created_at = Math.floor(Date.now() / 1000)
    const note_signed = await signEventPGA(oProfile, note)
    publish(note_signed)
    setSubmitEventButtonClassName('hide')
    setCreateAnotherElementClassName('show')
  }, [content])

  const createAnotherNoteButton = useCallback(() => {
    setSubmitEventButtonClassName('mt-3')
    setCreateAnotherElementClassName('hide')
    setContent('')
  }, [content])
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
        </CCol>
      </CRow>
    </>
  )
}

export default PublishNote
