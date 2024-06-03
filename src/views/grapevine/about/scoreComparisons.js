import { cibGit, cibGithub } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CContainer, CNavLink, CRow } from '@coreui/react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { updateNpub } from 'src/redux/features/siteNavigation/slice'

const GrapevineScoreComparisons = () => {
  return (
    <>
      <CContainer>
        <center>
          <h3>Score Comparisions</h3>
        </center>
        <br />
        <CRow>
          <li>
            The Web of Trust score is excellent for eliminating spam, but cannot look past 2 hops on
            your social graph.
          </li>
          <li>
            Unlike the WoT score, the Influence Score can see more than 2 hops away on your social
            graph.
          </li>
          <li>
            Of the three methods, the Influence Score is best suited to incorporate contextual trust
            attestations, once such data becomes available.
          </li>
        </CRow>
        <br />
        <br />
        <center>
          <h3>Content Discovery</h3>
        </center>
        <CRow>COMING SOON: Contextual Influence Scores.</CRow>
      </CContainer>
    </>
  )
}

export default GrapevineScoreComparisons
