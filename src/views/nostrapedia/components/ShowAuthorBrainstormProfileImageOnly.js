import React from 'react'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { CNavLink } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { updateNpub } from 'src/redux/features/siteNavigation/slice'
import { updateViewProfileTab } from '../../../redux/features/siteNavigation/slice'
import { getProfileBrainstormFromNpub } from '../../../helpers/brainstorm'
import { noProfilePicUrl } from '../../../const'

const GetProfileFromNdk = ({ npub, oProfilesByNpub }) => {
  const dispatch = useDispatch()
  const { getProfile } = useNDK()

  const oProfile = getProfile(npub)
  let author = '...' + npub.slice(-6)
  if (oProfile) {
    if (oProfile?.displayName) {
      author = oProfile?.displayName
    }
    if (!oProfile?.displayName && oProfile?.name) {
      author = '@' + oProfile?.name
    }
  }

  if (oProfile && !oProfile.image) {
    oProfile.image = noProfilePicUrl
  }
  const setCurrentNpub = (newNpub) => {
    dispatch(updateNpub(newNpub))
    // dispatch(updateViewProfileTab('wikis'))
  }
  // ? TO DO: update local redux store with info ?
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className="profileAvatarContainerSmall">
        <CNavLink href="#/profile" onClick={() => setCurrentNpub(npub)}>
          <img src={oProfile?.image} className="profileAvatarSmall" />
        </CNavLink>
      </div>
      <div style={{ display: 'inline-block', marginLeft: '10px' }} className="d-none d-lg-block">
        <strong>{author}</strong>
      </div>
    </div>
  )
}

export const ShowAuthorBrainstormProfileImageOnly = ({ npub }) => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oProfileBrainstorm = getProfileBrainstormFromNpub(npub, oProfilesByNpub)
  const dispatch = useDispatch()

  const setCurrentNpub = (newNpub) => {
    dispatch(updateNpub(newNpub))
    // dispatch(updateViewProfileTab('wikis'))
  }
  if (oProfileBrainstorm.brainstorm == true) {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="profileAvatarContainerSmall">
          <CNavLink href="#/profile" onClick={() => setCurrentNpub(npub)}>
            <img
              src={oProfileBrainstorm?.picture}
              alt={noProfilePicUrl}
              className="profileAvatarSmall"
            />
          </CNavLink>
        </div>
        <div style={{ display: 'inline-block', marginLeft: '10px' }} className="d-none d-lg-block">
          <strong>{oProfileBrainstorm.brainstormDisplayName}</strong>
        </div>
      </div>
    )
  }
  return <GetProfileFromNdk npub={npub} oProfilesByNpub={oProfilesByNpub} />
}
