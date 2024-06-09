import { CContainer, CRow } from '@coreui/react'
import React from 'react'

const AboutWotScore = () => {
  return (
    <>
      <CContainer>
        <center>
          <h3>The Web of Trust (WoT) Score</h3>
        </center>
        <br />
        <CRow>
          The WoT Score is more or less the state of the art for web of trust content curation on
          nostr.
          <br />
          <br />
          The number of profiles in the intersection between your follows and another profile's
          followers equals that profile's WoT Score. In many implementations, the score is reduced
          by some amount by mutes (not yet implemented here at brainStorm).
          <br />
          <br />
          The WoT does a good job of filtering out obvious spam. However, any profile more than two
          hops away from you will have a WoT score of zero.
        </CRow>
      </CContainer>
    </>
  )
}

export default AboutWotScore