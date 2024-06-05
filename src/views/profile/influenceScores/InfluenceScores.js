import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TwittrNote from 'src/views/twittr/components/twittrNote'
import {
  CCol,
  CContainer,
  CFormSwitch,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { getProfileBrainstormFromPubkey } from 'src/helpers/brainstorm'
import { convertInputToCertainty } from 'src/helpers/grapevine'
import { getPubkeyFromNpub } from 'src/helpers/nip19'

const ShowCalculations = ({ showRawDataButton, oProfile, oProfilesByNpub }) => {
  if (showRawDataButton == 'hide') {
    return <></>
  }

  const npub = useSelector((state) => state.siteNavigation.npub)
  const pubkey = getPubkeyFromNpub(npub)

  const myPubkey = useSelector((state) => state.profile.pubkey)
  const attenuationFactor_ = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.attenuationFactor) / 100,
  )
  const followInterpretationScore_ = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.followInterpretation.score) /
      100,
  )
  const followInterpretationConfidence_ = Number(
    useSelector(
      (state) => state.grapevine.controlPanels.baseLayer.followInterpretation.confidence,
    ) / 100,
  )
  const muteInterpretationScore_ = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.muteInterpretation.score) / 100,
  )
  const muteInterpretationConfidence_ = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.muteInterpretation.confidence) /
      100,
  )
  const rigor_ = Number(useSelector((state) => state.grapevine.controlPanels.baseLayer.rigor)) / 100

  const aFollowers = oProfile.followers
  const aMutedBy = oProfile.mutedBy

  const [sumOfWeights, setSumOfWeights] = useState(0)
  const [sumOfProducts, setSumOfProducts] = useState(0)
  const [inputCalc, setInputCalc] = useState(0)
  const [certaintyCalc, setCertaintyCalc] = useState(0)
  const [averageScoreCalc, setAverageScoreCalc] = useState(0)
  const [influenceCalc, setInfluenceCalc] = useState(0)

  useEffect(() => {
    let sumOfWeights_temp = 0
    let sumOfProducts_temp = 0
    aFollowers.forEach((pk, item) => {
      if (pk != pubkey) {
        // cannot rate oneself
        const oProfileBrainstorm = getProfileBrainstormFromPubkey(pk, oProfilesByNpub)
        const raterInfluence_ = oProfileBrainstorm.wotScores.baselineInfluence.influence
        const rating_ = followInterpretationScore_
        const ratingConfidence_ = followInterpretationConfidence_
        let weight = (
          rating_ *
          attenuationFactor_ *
          raterInfluence_ *
          ratingConfidence_
        ).toPrecision(4)
        if (pk == myPubkey) {
          weight = (rating_ * raterInfluence_ * ratingConfidence_).toPrecision(4)
        }
        const product = weight * rating_
        sumOfWeights_temp += Number(weight)
        sumOfProducts_temp += Number(product)
      }
    })
    // TO DO: process mutes
    setSumOfWeights(sumOfWeights_temp)
    setSumOfProducts(sumOfProducts_temp)
    const input_temp = sumOfWeights_temp.toPrecision(4)
    setInputCalc(input_temp)
    const certainty_temp = convertInputToCertainty(input_temp, rigor_)
    setCertaintyCalc(certainty_temp)
    if (sumOfWeights_temp > 0) {
      const average_temp = (sumOfProducts_temp / sumOfWeights_temp).toPrecision(4)
      setAverageScoreCalc(average_temp)
      const influence_temp = average_temp * certainty_temp
      setInfluenceCalc(influence_temp)
    }
  }, [])

  const followInterpretationScore = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.followInterpretation.score),
  )
  const followInterpretationConfidence = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.followInterpretation.confidence),
  )
  const muteInterpretationScore = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.muteInterpretation.score),
  )
  const muteInterpretationConfidence = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.muteInterpretation.confidence),
  )

  return (
    <>
      <CRow>
        <center>Notes on the calculation of Influence Scores:</center>
        <br />
        <li>
          Follows and mutes are the raw data. <i>Contextual trust attestations</i> as per the
          proposed{' '}
          <a target="_blank" href="https://github.com/lez/nips/blob/master/77.md" rel="noreferrer">
            NIP-77
          </a>{' '}
          will be incorporated soon.{' '}
        </li>
        <li>
          Each follow (or mute) is "interpreted" as a contextual trust attestation by assigning a
          score of {followInterpretationScore} ({muteInterpretationScore}) with a confidence of{' '}
          {followInterpretationConfidence}% ({muteInterpretationConfidence} %). These parameters are
          adjustable in the settings.
        </li>
        <li>
          Average Score is a weighted average, with the weight dependent upon the influence of the
          follower and the confidence of the trust attestation.{' '}
        </li>
        <li>
          <code>Influence = Average Score * Certainty</code>
        </li>
        <li>Input is the sum over all weights.</li>
        <li>
          Certainty is calculated from Input using an equation as discussed in{' '}
          <a
            target="_blank"
            href="https://habla.news/a/naddr1qqxnzdes8q6rwv3hxs6rjvpeqgs98k45ww24g26dl8yatvefx3qrkaglp2yzu6dm3hv2vcxl822lqtgrqsqqqa28kn8wur"
            rel="noreferrer"
          >
            this blog post
          </a>
          .
        </li>
        <li>
          These equations are iterated over and over until an equilibrium is reached, making this
          method a computationally expensive one.
        </li>
      </CRow>

      <br />

      <CRow>
        <div>sumOfWeights: {sumOfWeights}</div>
        <div>sumOfProducts: {sumOfProducts}</div>
        <div>inputCalc: {inputCalc}</div>
        <div>certaintyCalc: {certaintyCalc}</div>
        <div>averageScoreCalc: {averageScoreCalc}</div>
        <div>influenceCalc: {influenceCalc}</div>
        <div>aMutedBy length: {aMutedBy.length}</div>
        <div>aFollowers length: {aFollowers.length}</div>
      </CRow>

      <br />

      <CRow>
        <div style={{ height: '300px', overflow: 'scroll' }}>
          <CCol>
            <div style={{ marginBottom: '5px' }}>
              <strong>Follows:</strong>
            </div>
            <CTable small>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">rater</CTableHeaderCell>
                  <CTableHeaderCell scope="col">product</CTableHeaderCell>
                  <CTableHeaderCell scope="col">rating</CTableHeaderCell>
                  <CTableHeaderCell scope="col">weight</CTableHeaderCell>
                  <CTableHeaderCell scope="col">---</CTableHeaderCell>
                  <CTableHeaderCell scope="col">weight</CTableHeaderCell>
                  <CTableHeaderCell scope="col">rater influence</CTableHeaderCell>
                  <CTableHeaderCell scope="col">rating confidence</CTableHeaderCell>
                  <CTableHeaderCell scope="col">attenuation factor</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {aFollowers.map((pk, item) => {
                  if (pk != pubkey) {
                    // cannot rate oneself
                    const oProfileBrainstorm = getProfileBrainstormFromPubkey(pk, oProfilesByNpub)
                    const raterInfluence_ = oProfileBrainstorm.wotScores.baselineInfluence.influence
                    const rating_ = followInterpretationScore_
                    const ratingConfidence_ = followInterpretationConfidence_
                    let weight = (
                      rating_ *
                      attenuationFactor_ *
                      raterInfluence_ *
                      ratingConfidence_
                    ).toPrecision(4)
                    if (pk == myPubkey) {
                      weight = (rating_ * raterInfluence_ * ratingConfidence_).toPrecision(4)
                    }
                    const product = weight * rating_
                    return (
                      <CTableRow key={item}>
                        <CTableDataCell>{oProfileBrainstorm.brainstormDisplayName}</CTableDataCell>
                        <CTableDataCell>{product}</CTableDataCell>
                        <CTableDataCell>{rating_}</CTableDataCell>
                        <CTableDataCell>{weight}</CTableDataCell>
                        <CTableDataCell></CTableDataCell>
                        <CTableDataCell>{weight} =</CTableDataCell>
                        <CTableDataCell>{raterInfluence_}</CTableDataCell>
                        <CTableDataCell>* {ratingConfidence_}</CTableDataCell>
                        <CTableDataCell>* {attenuationFactor_}</CTableDataCell>
                      </CTableRow>
                    )
                  }
                })}
              </CTableBody>
            </CTable>
            <br />
            <div style={{ marginBottom: '5px' }}>
              <strong>Mutes (table pending):</strong>
            </div>
          </CCol>
        </div>
      </CRow>
    </>
  )
}

const InfluenceScores = ({ oProfile, oProfilesByNpub }) => {
  const influence = oProfile.wotScores.baselineInfluence.influence
  const averageScore = oProfile.wotScores.baselineInfluence.averageScore
  const input = oProfile.wotScores.baselineInfluence.input
  const certainty = oProfile.wotScores.baselineInfluence.certainty

  const [showRawDataButton, setShowRawDataButton] = useState('hide')
  const toggleShowRawData = useCallback(
    (e) => {
      if (showRawDataButton == 'hide') {
        setShowRawDataButton('show')
      }
      if (showRawDataButton == 'show') {
        setShowRawDataButton('hide')
      }
    },
    [showRawDataButton],
  )

  return (
    <>
      <CContainer>
        <CRow>
          <CCol>
            <center>
              <h3>Influence Scores</h3>
            </center>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CTable small>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">influence</CTableHeaderCell>
                  <CTableHeaderCell scope="col">average score</CTableHeaderCell>
                  <CTableHeaderCell scope="col">certainty</CTableHeaderCell>
                  <CTableHeaderCell scope="col">input</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableDataCell>{influence}</CTableDataCell>
                <CTableDataCell>{averageScore}</CTableDataCell>
                <CTableDataCell>{certainty}</CTableDataCell>
                <CTableDataCell>{input}</CTableDataCell>
              </CTableBody>
            </CTable>
          </CCol>
        </CRow>
        <br />
        <center>Interpretation:</center>
        <br />
        <li>
          Influence = 1: worthy of attention, no more or less than anyone else (probably a human
          being)
        </li>
        <li>Influence = 0: unworthy of attention (might be a bot)</li>
        <li>
          COMING SOON: Influence above 1: worthy of more than the usual amount of attention (in some given context)
        </li>
        <br />
        <CRow>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'inline-block' }}>
              <CFormSwitch
                onChange={(e) => toggleShowRawData(e)}
                label="show calculations"
                id="formSwitchCheckDefault"
              />
            </div>
          </div>
        </CRow>
        <ShowCalculations
          showRawDataButton={showRawDataButton}
          oProfile={oProfile}
          oProfilesByNpub={oProfilesByNpub}
        />
      </CContainer>
    </>
  )
}

export default InfluenceScores
