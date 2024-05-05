import {
  CCard,
  CCardBody,
  CCardTitle,
  CCol,
  CForm,
  CFormInput,
  CNavLink,
  CRow,
} from '@coreui/react'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateNpub } from '../../redux/features/siteNavigation/slice'

const Profiles = () => {
  const [npub, setNpub] = useState('')
  const { getProfile } = useNDK()

  const handleRateeNpubChange = useCallback(
    async (e) => {
      const newNpub = e.target.value
      setNpub(newNpub)
    },
    [npub],
  )

  const dispatch = useDispatch()
  const setCurrentNpub = (newNpub) => {
    dispatch(updateNpub(newNpub))
  }
  return (
    <>
      <div className="d-grid gap-2 col-12  mx-auto">
        <center>
          <h3>Find User</h3>
        </center>
        <CForm>
          <CFormInput
            type="text"
            label="enter user npub"
            placeholder="npub ..."
            value={npub}
            onChange={handleRateeNpubChange}
          />
        </CForm>
        <div>click to view user profile:</div>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardBody className="d-flex justify-content-between align-items-center">
                <CNavLink href="#/profile" onClick={() => setCurrentNpub(npub)}>
                  {getProfile(npub)?.name}
                  <br />
                  {npub}
                </CNavLink>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </>
  )
}

export default Profiles
