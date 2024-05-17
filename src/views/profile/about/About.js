import { cilClone } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CCol, CContainer, CRow } from '@coreui/react'
import React from 'react'
import RawDataNostrWord from '../../components/RawDataNostrWord'

const About = ({ oKind0Event, oKind3Event, oProfile, oProfileBrainstorm, oProfileNdk, npub, pubkey }) => {
  const copyNpubToClipboard = (np) => {
    navigator.clipboard.writeText(np)
    alert('npub copied to clipboard: \n ' + np)
  }
  const copyPubkeyToClipboard = (pk) => {
    navigator.clipboard.writeText(pk)
    alert('pubkey copied to clipboard: \n ' + pk)
  }
  const primalUrl = 'https://primal.net/p/' + npub

  const njumpUrl = 'https://njump.me/' + npub

  return (
    <CContainer className="px-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <CRow>
        <div style={{ color: 'grey' }}>npub:</div>
        <CCol style={{ overflowWrap: 'break-word' }}>
          {npub}{' '}
          <CIcon icon={cilClone} className="me-2" onClick={() => copyNpubToClipboard(npub)} />
        </CCol>
      </CRow>
      <CRow>
        <div style={{ color: 'grey' }}>pubkey:</div>
        <CCol style={{ overflowWrap: 'break-word' }}>
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
      <CRow>
        <div style={{ color: 'grey' }}>view in njump:</div>
        <CCol>
          <a href={njumpUrl} target="_blank" rel="noreferrer">
            njump
          </a>
        </CCol>
      </CRow>
      <CRow>
        <div style={{ color: 'grey' }}>view in primal:</div>
        <CCol>
          <a href={primalUrl} target="_blank" rel="noreferrer">
            Primal
          </a>
        </CCol>
      </CRow>
      <CRow>
        <RawDataNostrWord oEvent={oKind0Event} label="kind 0 event" />
      </CRow>
      <CRow>
        <RawDataNostrWord oEvent={oKind3Event} label="kind 3 event" />
      </CRow>
    </CContainer>
  )
}

export default About

/*
<CRow>
  <div>oProfileNdk:</div>
  <pre>{JSON.stringify(oProfileNdk, null, 4)}</pre>
  <div>oProfileBrainstorm:</div>
  <pre>{JSON.stringify(oProfileBrainstorm, null, 4)}</pre>
</CRow>
*/
