import { cilClone } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CCol, CContainer, CRow } from '@coreui/react'
import React from 'react'

const About = ({ oProfile, npub, pubkey }) => {
  const copyNpubToClipboard = (np) => {
    navigator.clipboard.writeText(np)
    alert('npub copied to clipboard: \n ' + np)
  }
  const copyPubkeyToClipboard = (pk) => {
    navigator.clipboard.writeText(pk)
    alert('pubkey copied to clipboard: \n ' + pk)
  }
  return (
    <CContainer
      className="px-4"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}
    >
      <CRow>
        <div style={{ color: 'grey' }}>npub:</div>
        <CCol>
          {npub}{' '}
          <CIcon icon={cilClone} className="me-2" onClick={() => copyNpubToClipboard(npub)} />
        </CCol>
      </CRow>
      <CRow>
        <div style={{ color: 'grey' }}>pubkey:</div>
        <CCol>
          {pubkey}{' '}
          <CIcon icon={cilClone} className="me-2" onClick={() => copyPubkeyToClipboard(pubkey)} />
        </CCol>
      </CRow>
      <CRow>
        <div style={{ color: 'grey' }}>about:</div>
        <CCol>{oProfile?.about}</CCol>
      </CRow>
      <CRow>
        <div style={{ color: 'grey' }}>bio:</div>
        <CCol>{oProfile?.bio}</CCol>
      </CRow>
      <CRow>
        <div style={{ color: 'grey' }}>website:</div>
        <CCol>
          <a href={oProfile?.website} target="_blank" rel="noreferrer">
            {oProfile?.website}
          </a>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default About
