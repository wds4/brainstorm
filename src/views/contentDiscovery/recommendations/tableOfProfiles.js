import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CNavLink,
  CPopover,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { ShowAuthorBrainstormProfileImageOnly } from '../../nostrapedia/components/ShowAuthorBrainstormProfileImageOnly'
import { nip19 } from 'nostr-tools'
import { convertInputToCertainty } from '../../../helpers/grapevine'
import CIcon from '@coreui/icons-react'
import { cilInfo } from '@coreui/icons'

const RecommendedProfiles = ({ context, oRatedPubkeys }) => {
  const rigor_ =
    Number(useSelector((state) => state.grapevine.controlPanels.contentDiscovery.rigor)) / 100

  const arraySorted = Object.keys(oRatedPubkeys).sort((a, b) => {
    // Calculating contextualInfluence
    // Note: it will be more efficient to calculate oRatedPubkeys[a].contextualInfluence just once for each pubkey prior to doing the sort
    // Ought to make a function: returnContextualInfluence(oRatedPubkeys, pubkey)
    // returnContextualInfluence for pubkey: a
    const sumOfInputs_a = oRatedPubkeys[a].sumOfInputs
    const sumOfWeights_a = oRatedPubkeys[a].sumOfWeights
    let averageScore_a = 0
    if (sumOfWeights_a > 0) {
      averageScore_a = sumOfInputs_a / (sumOfWeights_a * 100)
    }
    const certainty_a = convertInputToCertainty(sumOfInputs_a / 100, rigor_)
    const contextualInfluence_a = (certainty_a * averageScore_a).toPrecision(4)

    // returnContextualInfluence for pubkey: b
    const sumOfInputs_b = oRatedPubkeys[b].sumOfInputs
    const sumOfWeights_b = oRatedPubkeys[b].sumOfWeights
    let averageScore_b = 0
    if (sumOfWeights_b > 0) {
      averageScore_b = sumOfInputs_b / (sumOfWeights_b * 100)
    }
    const certainty_b = convertInputToCertainty(sumOfInputs_b / 100, rigor_)
    const contextualInfluence_b = (certainty_b * averageScore_b).toPrecision(4)

    return contextualInfluence_b - contextualInfluence_a
    // return oRatedPubkeys[a].sumOfInputs - oRatedPubkeys[b].sumOfInputs
  })

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <center>
                <h3>
                  Recommended Profiles for context:{' '}
                  <span style={{ color: '#3d99f5' }}>{context}</span>
                </h3>
              </center>
            </CCardHeader>
            <CCardBody>
              <CTable small>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">profile</CTableHeaderCell>
                    <CTableHeaderCell scope="col">average score
                    <span style={{ color: 'grey', marginLeft: '5px' }}>
                        <CPopover
                          content="The average score is your Grapevine's best estimate of the value of this user relative to a reference user (which generally means the average user)."
                          placement="top"
                          trigger={['hover', 'focus']}
                        >
                          <CIcon icon={cilInfo} size="lg" />
                        </CPopover>
                      </span>
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">certainty
                    <span style={{ color: 'grey', marginLeft: '5px' }}>
                        <CPopover
                          content="How confident your Grapevine is in the assessment of the average score. This is a function of how much trusted input goes in to its calculation."
                          placement="top"
                          trigger={['hover', 'focus']}
                        >
                          <CIcon icon={cilInfo} size="lg" />
                        </CPopover>
                      </span>
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">
                    🔥 contextual influence score 🔥
                      <span style={{ color: 'grey', marginLeft: '5px' }}>
                        <CPopover
                          content="influence score = average score * certainty"
                          placement="top"
                          trigger={['hover', 'focus']}
                        >
                          <CIcon icon={cilInfo} size="lg" />
                        </CPopover>
                      </span>
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {arraySorted.map((pubkey, item) => {
                    const npub = nip19.npubEncode(pubkey)
                    const sumOfInputs = oRatedPubkeys[pubkey].sumOfInputs
                    const sumOfWeights = oRatedPubkeys[pubkey].sumOfWeights
                    let averageScore = 0
                    if (sumOfWeights > 0) {
                      averageScore = sumOfInputs / (sumOfWeights * 100)
                    }
                    const certainty = convertInputToCertainty(sumOfInputs / 100, rigor_)
                    const contextualInfluence = (certainty * averageScore).toPrecision(4)
                    // const ratersByPubkey = oRatedPubkeys[pubkey].ratersByPubkey
                    return (
                      <CTableRow key={item}>
                        <CTableDataCell>
                          <ShowAuthorBrainstormProfileImageOnly npub={npub} />
                        </CTableDataCell>
                        <CTableDataCell>{averageScore.toPrecision(4)}</CTableDataCell>
                        <CTableDataCell>{(certainty * 100).toPrecision(4)} %</CTableDataCell>
                        <CTableDataCell>{contextualInfluence}</CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default RecommendedProfiles
