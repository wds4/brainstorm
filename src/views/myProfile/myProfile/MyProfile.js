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
          <div className="profileAvatarContainer">
            <img src={myPicture} className="profileAvatarLarge" />
          </div>
        </CCol>
        <CCol sm="auto">
          <div>
            <span style={{ fontSize: '34px', marginRight: '20px' }}>{myDisplayName}</span>
            <span style={{ color: 'grey' }}>@{myName}</span>
          </div>
          <small>{myNpub}</small>
        </CCol>
      </CRow>
      <CRow>
        <div>kind1Events.length: {kind1Events.length}</div>
      </CRow>
    </CContainer>
  )
}

export default MyProfile

/*
.grad1 img {
  -webkit-mask-image:-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))
}
<CRow>
  <div style={{ position: 'relative' }}>
    <div
      className="grad1"
      style={{
        width: '100%',
        maxHeight: '200px',
        position: 'absolute',
        top: '0px',
        overflow: 'scroll',
      }}
    >
      <img
        src={myBackground}
        style={{
          borderRadius: '20px 20px 0px 0px',
          width: '100%',
        }}
        alt=""
      />
    </div>
  </div>
</CRow>
*/
