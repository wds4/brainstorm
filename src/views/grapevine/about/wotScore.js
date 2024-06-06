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
          The number of profiles in the intersection between your follows and another profile's
          followers equals that profile's WoT Score.
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
