import React from 'react'
import { CCardBody, CNavLink } from '@coreui/react'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { nip19 } from 'nostr-tools'
import { useDispatch } from 'react-redux'
import { updateNpub } from 'src/redux/features/siteNavigation/slice'
import { secsToTimeAgo, fetchFirstByTag } from 'src/helpers'

// eslint-disable-next-line react/prop-types
export const ListEvent = ({ pubkey, oEvent, naddr, setNaddr, setOEvent }) => {
  const dispatch = useDispatch()
  const { getProfile } = useNDK()

  // title
  let titleStyle = {}
  let title = fetchFirstByTag('title', oEvent)
  if (!title) {
    title = 'no title provided'
    titleStyle = {
      color: 'orange',
    }
  }

  // category
  let categoryStyle = {}
  let category = fetchFirstByTag('c', oEvent)
  if (!category) {
    category = 'no category provided'
    categoryStyle = {
      color: 'orange',
    }
  }

  const npub = nip19.npubEncode(pubkey)
  const oProfile = getProfile(npub)
  let author = oProfile?.displayName
  if (!author) {
    author = '@' + oProfile?.name
  }
  if (!author) {
    author = npub
  }
  const setCurrentNpub = (newNpub) => {
    dispatch(updateNpub(newNpub))
  }
  const ToggleEvent = (naddr) => {
    setNaddr(naddr)
    setOEvent(oEvent)
  }

  let published_at = fetchFirstByTag('published_at', oEvent)
  if (!published_at) {
    published_at = oEvent.created_at
  }
  const displayTime = secsToTimeAgo(published_at)

  return (
    <div className="row justify-content-between"style={{ display: 'flex', alignItems: 'center' }} >
      <div className="col-md-auto profileAvatarContainerSmall" >
        <CNavLink href="#/profile" onClick={() => setCurrentNpub(npub)}>
          <img src={oProfile?.image} className="profileAvatarSmall" />
        </CNavLink>
      </div>
      <div className="col-3">
        <strong>{author}</strong>
      </div>
      <div className="col-3" style={titleStyle} onClick={() => ToggleEvent(naddr)}>
        <strong>{title}</strong>
      </div>
      <div className="col-3" style={categoryStyle}>
        <strong>{category}</strong>
      </div>
      <div className="col">
        <div style={{ float: 'right' }}>
          <small>{displayTime}</small>
        </div>
      </div>
    </div>
  )
}
