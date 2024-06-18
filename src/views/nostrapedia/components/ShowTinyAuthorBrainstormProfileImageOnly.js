import React from 'react'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { CNavLink, CPopover } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { updateNpub } from 'src/redux/features/siteNavigation/slice'
import { updateViewProfileTab } from '../../../redux/features/siteNavigation/slice'
import { getProfileBrainstormFromNpub } from '../../../helpers/brainstorm'
import { noProfilePicUrl } from '../../../const'

const GetProfileFromNdk = ({ npub, oProfilesByNpub, oProfileBrainstorm }) => {
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
  // const displayContent = author + '; Influence Score: ' + oProfileBrainstorm.wotScores.baselineInfluence.influence
  const displayContent = oProfileBrainstorm.wotScores.baselineInfluence.influence
  return (
    <CPopover content={displayContent} placement="top" trigger={['hover', 'focus']}>
      <div className="profileAvatarContainerTiny">
        <CNavLink href="#/profile" onClick={() => setCurrentNpub(npub)}>
          <img src={oProfile?.image} className="profileAvatarTiny" />
        </CNavLink>
      </div>
    </CPopover>
  )
}

export const ShowTinyAuthorBrainstormProfileImageOnly = ({ npub }) => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oProfileBrainstorm = getProfileBrainstormFromNpub(npub, oProfilesByNpub)
  const dispatch = useDispatch()

  const setCurrentNpub = (newNpub) => {
    dispatch(updateNpub(newNpub))
    // dispatch(updateViewProfileTab('wikis'))
  }
  if (oProfileBrainstorm.brainstorm == true) {
    /*
    const displayContent =
      oProfileBrainstorm.brainstormDisplayName +
      '; Influence Score: ' +
      oProfileBrainstorm.wotScores.baselineInfluence.influence
    */
    const displayContent = oProfileBrainstorm.wotScores.baselineInfluence.influence
    return (
      <CPopover content={displayContent} placement="top" trigger={['hover', 'focus']}>
        <div className="profileAvatarContainerTiny">
          <CNavLink href="#/profile" onClick={() => setCurrentNpub(npub)}>
            <img
              src={oProfileBrainstorm?.picture}
              alt={noProfilePicUrl}
              className="profileAvatarTiny"
            />
          </CNavLink>
        </div>
      </CPopover>
    )
  }
  return (
    <GetProfileFromNdk
      npub={npub}
      oProfilesByNpub={oProfilesByNpub}
      oProfileBrainstorm={oProfileBrainstorm}
    />
  )
}
