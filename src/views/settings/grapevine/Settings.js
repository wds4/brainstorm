import { CContainer } from '@coreui/react'
import React from 'react'
import InfluenceFromFollowsControlPanel from './controlPanels/influenceFromFollows/InfluenceFromFollows'

const GrapevineSettings = () => {
  return (
    <>
      <center>
        <h4>Settings: Grapevine</h4>
      </center>
      <CContainer className="px-4">
        <InfluenceFromFollowsControlPanel />
      </CContainer>
    </>
  )
}

export default GrapevineSettings
