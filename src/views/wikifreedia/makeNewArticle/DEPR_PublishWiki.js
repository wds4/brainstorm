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
} from '@coreui/react'
import { signEventPGA } from 'src/helpers/signers'
import { useSelector } from 'react-redux'
import { useNostr } from 'nostr-react'

const PublishWiki = ({content}) => {
  const oProfile = useSelector((state) => state.profile)
  const [submitEventButtonClassName, setSubmitEventButtonClassName] = useState('mt-3')
  const [createAnotherElementClassName, setCreateAnotherElementClassName] = useState('hide')

  const { publish } = useNostr()

  const publishKind30818Note = useCallback(async () => {
    const note = {}
    note.kind = 30818
    note.content = content
    note.tags = [
    ]
    note.created_at = Math.floor(Date.now() / 1000)
    const note_signed = await signEventPGA(oProfile, note)
    // publish(note_signed)
    setSubmitEventButtonClassName('hide')
    setCreateAnotherElementClassName('show')
  }, [content])

  const createAnotherNoteButton = useCallback(() => {
    setSubmitEventButtonClassName('mt-3')
    setCreateAnotherElementClassName('hide')
  }, [content])
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Make New Note</strong>
            </CCardHeader>
            <CCardBody>
              <CButton
                color="primary"
                className={submitEventButtonClassName}
                onClick={publishKind30818Note}
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

export default PublishWiki
