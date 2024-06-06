import { CContainer, CRow } from '@coreui/react'
import React from 'react'

const AboutDosScore = () => {
  return (
    <>
      <CContainer>
        <center>
          <h3>Degrees of Separation (DoS) Score</h3>
        </center>
        <br />
        <CRow>
          <div>
            The DoS Score of a profile equals the minimum number of hops required to get from you to
            that profile, using follows data.
          </div>
        </CRow>
      </CContainer>
    </>
  )
}

export default AboutDosScore
