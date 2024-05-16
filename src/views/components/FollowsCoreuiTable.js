import React from 'react'
import { CListGroup, CListGroupItem } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { nip19 } from 'nostr-tools'
import { updateNpub } from 'src/redux/features/siteNavigation/slice'
import { DocsExample } from '../../components'

const FollowsCoreuiTable = ({ aFollows }) => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const dispatch = useDispatch()
  const { getProfile } = useNDK()
  const setCurrentNpub = (newNpub) => {
    dispatch(updateNpub(newNpub))
  }
  return (
    <>
      <center>
        <h3>{aFollows.length} Follows</h3>
      </center>
      <CListGroup>
        {aFollows.map((pubkey, item) => {
          const npub = nip19.npubEncode(pubkey)
          let nameToShow = '...' + npub.slice(-10)
          if (oProfilesByNpub[npub]) {
            const oProf = oProfilesByNpub[npub]
            if (oProf.kind0 && oProf.kind0.oEvent) {
              const oK0Event = oProf.kind0.oEvent
              const oContent = JSON.parse(oK0Event.content)
              const name = oContent?.name
              const displayName = oContent?.display_name
              if (name) {
                nameToShow = name
              }
              if (displayName) {
                nameToShow = displayName
              }
            }
          }
          /*
          const name = getProfile(npub)?.name
          if (name) {
            nameToShow = name
          }
          */
          return (
            <CListGroupItem key={item} as="a" href="#/profile" onClick={() => setCurrentNpub(npub)}>
              {nameToShow}
            </CListGroupItem>
          )
        })}
      </CListGroup>
    </>
  )
}

export default FollowsCoreuiTable
