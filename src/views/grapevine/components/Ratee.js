import React from 'react'
import { CCardBody, CNavLink } from '@coreui/react'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { nip19 } from 'nostr-tools'
import { fetchFirstByTag } from '../../../helpers'

// eslint-disable-next-line react/prop-types
export const Ratee = ({ event }) => {
  const { getProfile } = useNDK()
  const pubkey = fetchFirstByTag('p', event)
  const npub = nip19.npubEncode(pubkey)
  const oProfile = getProfile(npub)
  let ratee = oProfile?.name
  if (!ratee) {
    ratee = oProfile?.displayName
  }
  if (!ratee) {
    ratee = npub
  }
  return (
    <CCardBody className="d-flex justify-content-between align-items-center">
      <span>
        <div style={{ display: 'inline-block' }}>
          <CNavLink href="#/profile" onClick={() => setCurrentNpub(npub)}>
            <strong>{ratee}</strong>
          </CNavLink>
        </div>
      </span>
    </CCardBody>
  )
}
