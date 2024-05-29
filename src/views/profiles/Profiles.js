import React from 'react'
import { useSelector } from 'react-redux'
// import TanstackReactTable from './TanstackReactTable'

import TanstackProfilesTable from '../components/TanstackProfilesTable'
import FollowersCrawlerListener from '../../helpers/listeners/FollowersCrawlerListener'
// import CalculateDegreesOfSeparation from './calculateDegreesOfSeparation'

const Profiles = () => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const aNpubsToDisplay = Object.keys(oProfilesByNpub)

  const oProfilesByPubkey = useSelector((state) => state.profiles.oProfiles.byPubkey)
  const aPubkeysToDisplay = Object.keys(oProfilesByPubkey)

  const updateWhichTab = () => {} // dummy function

  return (
    <>
      <div className="d-grid gap-2 col-12  mx-auto">
        <center>
          <h3>{Object.keys(oProfilesByNpub).length} Profiles</h3>
        </center>
        <FollowersCrawlerListener />
        <div style={{ overflow: 'scroll' }}>
          <TanstackProfilesTable aPubkeysToDisplay={aPubkeysToDisplay} aNpubsToDisplay={aNpubsToDisplay} oProfilesByNpub={oProfilesByNpub} updateWhichTab={updateWhichTab} />
        </div>
      </div>
    </>
  )
}

export default Profiles

// <CalculateDegreesOfSeparation />
