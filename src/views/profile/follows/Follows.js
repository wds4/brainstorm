import { CContainer, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import FollowsCoreuiTable from 'src/views/components/FollowsCoreuiTable'
import TanstackProfilesTable from '../../components/TanstackProfilesTable'
import { useSelector } from 'react-redux'
import { nip19 } from 'nostr-tools'

/*
TO DO: for some reason this table renders initially with zero rows.
The ShowTableWhenReady strategy did not fix it. Need to address this.

One (the primary?) reason: it takes time to calculate the npubs from pubkeys over the entire follow list.

Perhaps feed the pubkeys to the table and have the table determine npubs when those rows are displayed?
*/

const ShowTableWhenReady = ({readyToDisplayTable, aNpubsToDisplay, oProfilesByNpub}) => {
  if (!readyToDisplayTable) {
    return <div>Table Not Ready To Display</div>
  }
  if (readyToDisplayTable) {
    return (
      <>
        <TanstackProfilesTable aNpubsToDisplay={aNpubsToDisplay} oProfilesByNpub={oProfilesByNpub}/>
      </>
    )
  }
  return <div>Table Not Ready To Display</div>
}

const Follows = ({ aFollowNpubs, aFollowPubkeys, npub, oKind3Event }) => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const [aNpubsToDisplay, setANpubsToDisplay] = useState(aFollowNpubs)
  const [readyToDisplayTable, setReadyToDisplayTable] = useState(true)

  /*
  useEffect(() => {
    const aOutput = []
    aFollowPubkeys.forEach((pk) => {
      // console.log('aProfilesByNpub; pk: ' + pk)
      const np = nip19.npubEncode(pk)
      if (np) {
        aOutput.push(np)
      }
    })
    setANpubsToDisplay(aOutput)
    setReadyToDisplayTable(true)
  }, [aFollowPubkeys])
  */

  return (
    <CContainer className="px-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <CRow>
        <center><h3>Following {aFollowPubkeys.length} profiles</h3></center>
        <ShowTableWhenReady readyToDisplayTable={readyToDisplayTable} aNpubsToDisplay={aNpubsToDisplay} oProfilesByNpub={oProfilesByNpub} />
      </CRow>
    </CContainer>
  )
}

export default Follows

// <FollowsCoreuiTable aFollows={aFollowPubkeys} />
// redundant to have this here and on the main profile page
// <ProfilesDataListener aPubkeys={aFollowPubkeys} />
