import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  turnListenerOff,
  turnListenerOn,
  updateFilter,
  updateListenerApplication,
} from '../../redux/features/listenerManager/slice'
import { updateApp } from '../../redux/features/siteNavigation/slice'
// import TanstackReactTable from './TanstackReactTable'

import { nip19 } from 'nostr-tools'
import TanstackProfilesTable from '../components/TanstackProfilesTable'
import FollowersCrawlerListener from '../../helpers/listeners/FollowersCrawlerListener'
// import CalculateDegreesOfSeparation from './calculateDegreesOfSeparation'

const Profiles = () => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const aNpubsToDisplay = Object.keys(oProfilesByNpub)

  const oProfilesByPubkey = useSelector((state) => state.profiles.oProfiles.byPubkey)
  const aPubkeysToDisplay = Object.keys(oProfilesByPubkey)

  /*
  const dispatch = useDispatch()
  const turnListenerOnButton = () => {
    const aProfilePubkeysToSearch = []
    Object.keys(oProfilesByNpub).forEach((np) => {
      const decoded = nip19.decode(np)
      if (decoded.type == 'npub') {
        const pk = decoded.data
        aProfilePubkeysToSearch.push(pk)
      }
    })
    const filter = {
      kinds: [0, 3],
      authors: aProfilePubkeysToSearch,
    }
    console.log('turnListenerOnButton')
    dispatch(updateFilter(filter))
    dispatch(turnListenerOn())
  }
  const turnListenerOffButton = () => {
    console.log('turnListenerOffButton')
    dispatch(turnListenerOff())
  }
  */
  const updateWhichTab = () => {
    // dummy function
  }

  return (
    <>
      <div className="d-grid gap-2 col-12  mx-auto">
        <center>
          <h3>{Object.keys(oProfilesByNpub).length} Profiles</h3>
        </center>
        <FollowersCrawlerListener />
        <TanstackProfilesTable aPubkeysToDisplay={aPubkeysToDisplay} aNpubsToDisplay={aNpubsToDisplay} oProfilesByNpub={oProfilesByNpub} updateWhichTab={updateWhichTab} />
      </div>
    </>
  )
}

export default Profiles

// <CalculateDegreesOfSeparation />
