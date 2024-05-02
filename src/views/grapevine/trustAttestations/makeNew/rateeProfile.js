import { CCardTitle, CNavLink } from '@coreui/react'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { updateNpub } from 'src/redux/features/siteNavigation/slice'

// eslint-disable-next-line react/prop-types
const RateeProfile = ({ npub }) => {
  const dispatch = useDispatch()
  const setCurrentNpub = (newNpub) => {
    dispatch(updateNpub(newNpub))
  }
  const { getProfile } = useNDK()
  return (
    <CCardTitle>
      <CNavLink href="#/profile" onClick={() => setCurrentNpub(npub)}>
        {getProfile(npub)?.name}
      </CNavLink>
    </CCardTitle>
  )
}

export default RateeProfile
