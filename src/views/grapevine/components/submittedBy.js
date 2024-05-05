import React from 'react'
import { CCardBody, CNavLink } from '@coreui/react'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { nip19 } from 'nostr-tools'
import { secsToTimeAgo } from '../../../helpers'
import { useDispatch } from 'react-redux'
import { updateNpub } from '../../../redux/features/siteNavigation/slice'

// eslint-disable-next-line react/prop-types
export const SubmittedBy = ({ event }) => {
  const dispatch = useDispatch()
  const { getProfile } = useNDK()
  const pubkey = event.pubkey
  const npub = nip19.npubEncode(pubkey)
  const oProfile = getProfile(npub)
  let author = oProfile?.name
  if (!author) {
    author = oProfile?.displayName
  }
  if (!author) {
    author = npub
  }
  const displayTime = secsToTimeAgo(event.created_at)
  const setCurrentNpub = (newNpub) => {
    dispatch(updateNpub(newNpub))
  }
  return (
    <CCardBody className="d-flex justify-content-between align-items-center">
      <span>
        <small style={{ textDecoration: 'underline' }}>author:</small>{' '}
        <div style={{ display: 'inline-block' }}>
          <CNavLink href="#/profile" onClick={() => setCurrentNpub(npub)}>
            <strong>{author}</strong>
          </CNavLink>
        </div>
      </span>
      <span>
        <small>{displayTime}</small>
      </span>
    </CCardBody>
  )
}
