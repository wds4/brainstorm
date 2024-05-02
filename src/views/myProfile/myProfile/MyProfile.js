import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { CAvatar, CCol, CContainer, CRow } from '@coreui/react'

const MyProfile = () => {
  const myNpub = useSelector((state) => state.profile.npub)
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const myName = useSelector((state) => state.profile.name)
  const myDisplayName = useSelector((state) => state.profile.display_name)
  const myPicture = useSelector((state) => state.profile.picture)
  const myBackground = useSelector((state) => state.profile.banner)

  const { fetchEvents } = useNDK()

  const [kind1Events, setKind1Events] = useState([])

  const filter = {
    authors: [myPubkey],
    since: 0,
    kinds: [1],
  }
  useEffect(() => {
    async function updateMyFollowsAndRelays() {
      if (myPubkey) {
        const events = await fetchEvents(filter)
        // cycle through events and add them to kind1Events; they seem to come in spurts
        setKind1Events(events)
      }
    }
    updateMyFollowsAndRelays()
  }, [fetchEvents(filter)])

  return (
    <CContainer fluid>
      <CRow>
        <CCol sm="auto">
          <CAvatar src={myPicture} size="xl" />
        </CCol>
        <CCol sm="auto">
          <strong>{myDisplayName}</strong>
          <br />
          <small>{myNpub}</small>
        </CCol>
      </CRow>
      <CRow>
        <div style={{ color: 'grey' }}>@{myName}</div>
      </CRow>
      <CRow>
        <img src={myBackground} style={{ width: '100%' }} alt="" />
      </CRow>
      <CRow>
        <div>kind1Events.length: {kind1Events.length}</div>
      </CRow>
    </CContainer>
  )
}

export default MyProfile
