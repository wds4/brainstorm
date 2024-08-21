import { CContainer, CRow } from '@coreui/react'
import React from 'react'
import ExportInfluenceScores from './exportInfluenceScores'

const ExportGrapevineScores = () => {
  return (
    <>
      <CContainer>
        <center>
          <h3>Export Grapevine Score Lists</h3>
          <p>Let your Grapevine suggest some awesome new plebs to follow!</p>
        </center>
        <br />
        <CRow>
          <ExportInfluenceScores />
        </CRow>
      </CContainer>
    </>
  )
}

export default ExportGrapevineScores
