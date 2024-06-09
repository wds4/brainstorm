import React from 'react'
import { useSelector } from 'react-redux'
import TanstackProfilesTable from '../components/TanstackProfilesTable'

const Profiles = () => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oProfilesByPubkey = useSelector((state) => state.profiles.oProfiles.byPubkey)
  const aPubkeysToDisplay = Object.keys(oProfilesByPubkey)

  return (
    <>
      <div className="d-grid gap-2 col-12  mx-auto">
        <center>
          <h3>{Object.keys(oProfilesByNpub).length} Profiles</h3>
        </center>
        <div style={{ overflow: 'scroll' }}>
          <TanstackProfilesTable
            aPubkeysToDisplay={aPubkeysToDisplay}
            oProfilesByNpub={oProfilesByNpub}
          />
        </div>
      </div>
    </>
  )
}

export default Profiles
