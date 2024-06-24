import { CContainer } from '@coreui/react'
import React from 'react'
import InfluenceFromFollowsControlPanel from './controlPanels/influenceFromContextualEndorsements/InfluenceFromContextualEndorsements'

const ContentDiscoverySettings = () => {
  return (
    <>
      <center>
        <h4>Settings: Content Discovery</h4>
      </center>
      <CContainer className="px-4">
        <InfluenceFromFollowsControlPanel />
      </CContainer>
    </>
  )
}

export default ContentDiscoverySettings
