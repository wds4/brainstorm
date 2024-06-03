import React, { useCallback, useState } from 'react'
import { CCol, CNavLink, CRow, CWidgetStatsF } from '@coreui/react'
import { DocsExample } from 'src/components'
import CIcon from '@coreui/icons-react'
import { cilBolt, cilBoltCircle, cilCircle, cilGraph, cilThumbUp } from '@coreui/icons'
import { useSelector } from 'react-redux'

const GrapevineCalculations = () => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oScoreUpdates = useSelector((state) => state.settings.grapevine.scoreUpdates)

  let numInfluenceScoreProfiles = 0
  let numDosScoreProfiles = 0
  let numWotScoreProfiles = 0
  let influenceScoreTimestamp = 0
  let wotScoreTimestamp = 0
  let dosScoreTimestamp = 0
  if (oScoreUpdates) {
    if (oScoreUpdates.influenceScore) {
      numInfluenceScoreProfiles = oScoreUpdates.influenceScore.numProfiles
      influenceScoreTimestamp = oScoreUpdates.influenceScore.timestamp
    }
    if (oScoreUpdates.wotScore) {
      numWotScoreProfiles = oScoreUpdates.wotScore.numProfiles
      wotScoreTimestamp = oScoreUpdates.wotScore.timestamp
    }
    if (oScoreUpdates.degreesOfSeparation) {
      numDosScoreProfiles = oScoreUpdates.degreesOfSeparation.numProfiles
      dosScoreTimestamp = oScoreUpdates.degreesOfSeparation.timestamp
    }
  }
  const influenceScoreProfilesToAdd =
    Object.keys(oProfilesByNpub).length - numInfluenceScoreProfiles
  const wotScoreProfilesToAdd = Object.keys(oProfilesByNpub).length - numWotScoreProfiles
  const dosScoreProfilesToAdd = Object.keys(oProfilesByNpub).length - numDosScoreProfiles

  let influenceScores_value = ''
  let influenceScores_title = ''
  if (!influenceScoreTimestamp || !numInfluenceScoreProfiles) {
    influenceScores_value = 'Calculate Influence Scores'
    influenceScores_title = 'never calculated '
  }
  if (influenceScoreProfilesToAdd > 0) {
    influenceScores_value = 'recalculate Influence Scores'
    influenceScores_title = 'need to calculate for ' + influenceScoreProfilesToAdd + ' profiles'
  }
  if (influenceScoreProfilesToAdd == 0) {
    influenceScores_value = 'recalculate Influence Scores'
    influenceScores_title = 'no new profiles'
  }

  let wotScores_value = ''
  let wotScores_title = ''
  if (!wotScoreTimestamp || !numWotScoreProfiles) {
    wotScores_value = 'Calculate WoT Scores'
    wotScores_title = 'never calculated '
  }
  if (wotScoreProfilesToAdd > 0) {
    wotScores_value = 'recalculate WoT Scores'
    wotScores_title = 'need to calculate for ' + wotScoreProfilesToAdd + ' profiles'
  }
  if (wotScoreProfilesToAdd == 0) {
    wotScores_value = 'recalculate WoT Scores'
    wotScores_title = 'no new profiles'
  }

  let dosScores_value = ''
  let dosScores_title = ''
  if (!dosScoreTimestamp || !numDosScoreProfiles) {
    dosScores_value = 'Calculate DoS Scores'
    dosScores_title = 'never calculated'
  }
  if (dosScoreProfilesToAdd > 0) {
    dosScores_value = 'recalculate DoS Scores'
    dosScores_title = 'need to calculate for ' + dosScoreProfilesToAdd + ' profiles'
  }
  if (dosScoreProfilesToAdd == 0) {
    dosScores_value = 'recalculate DoS Scores'
    dosScores_title = 'no new profiles'
  }

  return (
    <>
      <center>
        <h4>Grapevine Calculations</h4>
      </center>
      <br />
      <div>
        Using follows and mutes, the Grapevine offers three scoring methods to stratify content on
        Nostrapedia: degrees of separation (DoS), web of trust (WoT), and Influence Scores. You can
        use this page to recalculate each of these scores from scratch.
      </div>
      <br />
      <DocsExample href="components/widgets/#cwidgetstatsf">
        <CRow xs={{ gutter: 4 }}>
          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CNavLink href="#/grapevine/calculateInfluenceScores">
              <CWidgetStatsF
                icon={<CIcon width={24} icon={cilThumbUp} size="xl" />}
                title={influenceScores_title}
                value={influenceScores_value}
                color="info"
              />
            </CNavLink>
          </CCol>

          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CNavLink href="#/grapevine/calculateWotScores">
              <CWidgetStatsF
                icon={<CIcon width={24} icon={cilThumbUp} size="xl" />}
                title={wotScores_title}
                value={wotScores_value}
                color="info"
              />
            </CNavLink>
          </CCol>

          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CNavLink href="#/grapevine/calculateDosScores">
              <CWidgetStatsF
                icon={<CIcon width={24} icon={cilGraph} size="xl" />}
                title={dosScores_title}
                value={dosScores_value}
                color="info"
              />
            </CNavLink>
          </CCol>
        </CRow>

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
      </DocsExample>
    </>
  )
}

export default GrapevineCalculations
