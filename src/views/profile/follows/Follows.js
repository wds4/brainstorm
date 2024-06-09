import { CContainer, CRow } from '@coreui/react'
import React from 'react'
import TanstackProfilesTable from '../../components/TanstackProfilesTable'

/*
TO DO: for some reason this table renders initially with zero rows.
The ShowTableWhenReady strategy did not fix it. Need to address this.

One (the primary?) reason: it takes time to calculate the npubs from pubkeys over the entire follow list.

Perhaps feed the pubkeys to the table and have the table determine npubs when those rows are displayed?
*/

const Follows = ({ oProfilesByNpub, aFollowPubkeys }) => {
  return (
    <CContainer
      className="px-4"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'scroll' }}
    >
      <CRow>
        <center>
          <h3>Following {aFollowPubkeys.length} profiles</h3>
        </center>
        <TanstackProfilesTable
          aPubkeysToDisplay={aFollowPubkeys}
          oProfilesByNpub={oProfilesByNpub}
        />
      </CRow>
    </CContainer>
  )
}

export default Follows
