import React from 'react'
import LeaveRating from './leaveRating/leaveTrustAttestation'
import About from './about/About'
import Notes from './notes/notes'
import Wikis from './wikis/Wikis'
import Follows from './follows/Follows'
import InfluenceScores from './influenceScores/InfluenceScores'

// eslint-disable-next-line react/prop-types
const TabsContent = ({
  whichTab,
  npub,
  pubkey,
  oProfile,
  oProfileNdk,
  oProfileBrainstorm,
  oKind0Event,
  oKind3Event,
  oKind10000Event,
  aFollowPubkeys,
  aFollowNpubs,
  updateWhichTab,
  oProfilesByNpub,
}) => {
  if (whichTab == 'about') {
    return (
      <About
        oKind0Event={oKind0Event}
        oKind3Event={oKind3Event}
        oKind10000Event={oKind10000Event}
        oProfile={oProfile}
        oProfileNdk={oProfileNdk}
        oProfileBrainstorm={oProfileBrainstorm}
        npub={npub}
        pubkey={pubkey}
        aFollowPubkeys={aFollowPubkeys}
      />
    )
  }
  if (whichTab == 'follows') {
    return <Follows oProfilesByNpub={oProfilesByNpub} aFollowPubkeys={aFollowPubkeys} />
  }
  if (whichTab == 'notes') {
    return <Notes oProfile={oProfile} pubkey={pubkey} />
  }
  if (whichTab == 'wikis') {
    return <Wikis oProfile={oProfile} npub={npub} pubkey={pubkey} />
  }
  if (whichTab == 'leaveRating') {
    return <LeaveRating rateeNpub={npub} />
  }
  if (whichTab == 'ratingsOf') {
    return <>profile tabs content: {whichTab} </>
  }
  if (whichTab == 'ratingsBy') {
    return <>profile tabs content: {whichTab} </>
  }
  if (whichTab == 'wotScores') {
    return (
      <InfluenceScores
        npub={npub}
        pubkey={pubkey}
        oProfile={oProfile}
        oProfilesByNpub={oProfilesByNpub}
      />
    )
  }
  return <>profile tabs content: {whichTab} </>
}

export default TabsContent
