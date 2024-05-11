import { CCol, CContainer, CNavLink, CRow } from '@coreui/react'
import React from 'react'
import { secsToTimeAgo } from '../../../helpers'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { useDispatch } from 'react-redux'
import { nip19 } from 'nostr-tools'
import { updateNpub } from '../../../redux/features/siteNavigation/slice'

const TwittrNote = ({ event }) => {
  const { getProfile } = useNDK()
  const dispatch = useDispatch()

  const displayTime = secsToTimeAgo(event?.created_at)
  const pk = event.pubkey
  const oProfile = getProfile(pk)
  const npub = nip19.npubEncode(pk)
  return (
    <div
      className="row"
      style={{ border: '1px solid grey', borderRadius: '10px', marginBottom: '5px' }}
    >
      <div className="col-md-auto profileAvatarContainerSmall">
        <CNavLink href="#/profile" onClick={() => dispatch(updateNpub(npub))}>
          <img src={oProfile?.image} className="profileAvatarSmall" />
        </CNavLink>
      </div>
      <div className="col">
        <div>
          {oProfile?.displayName}
          <span style={{ float: 'right', color: 'grey' }}>{displayTime}</span>
        </div>
        <div style={{ overflowWrap: 'break-word' }}>{event.content}</div>
      </div>
    </div>
  )
}

export default TwittrNote
