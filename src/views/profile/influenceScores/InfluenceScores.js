import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TwittrNote from 'src/views/twittr/components/twittrNote'
import {
  CCol,
  CContainer,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { getProfileBrainstormFromPubkey } from '../../../helpers/brainstorm'
import { convertInputToCertainty } from '../../../helpers/grapevine'

const InfluenceScores = ({ npub, pubkey, oProfile, oProfilesByNpub }) => {
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const attenuationFactor_ = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.attenuationFactor) / 100,
  )
  const followInterpretationScore_ = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.followInterpretation.score) / 100,
  )
  const followInterpretationConfidence_ = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.followInterpretation.confidence) / 100,
  )
  const rigor_ = Number(useSelector((state) => state.grapevine.controlPanels.baseLayer.rigor)) / 100

  const dos = oProfile.wotScores.degreesOfSeparationFromMe
  const influence = oProfile.wotScores.baselineInfluence.influence
  const averageScore = oProfile.wotScores.baselineInfluence.averageScore
  const input = oProfile.wotScores.baselineInfluence.input
  const certainty = oProfile.wotScores.baselineInfluence.certainty
  const aFollows = oProfile.follows
  const aFollowers = oProfile.followers
  const aMutes = oProfile.mutes
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
    aFollowers.forEach((pubkey, item) => {
      const oProfileBrainstorm = getProfileBrainstormFromPubkey(pubkey, oProfilesByNpub)
      const raterInfluence_ = oProfileBrainstorm.wotScores.baselineInfluence.influence
      const rating_ = followInterpretationScore_
      const ratingConfidence_ = followInterpretationConfidence_
      let weight = (rating_ * attenuationFactor_ * raterInfluence_ * ratingConfidence_).toPrecision(4)
      if (pubkey == myPubkey) {
        weight = (rating_ * raterInfluence_ * ratingConfidence_).toPrecision(4)
      }
      const product = weight * rating_
      sumOfWeights_temp += Number(weight)
      sumOfProducts_temp += Number(product)
    })
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

  return (
    <>
      <div>sumOfWeights: {sumOfWeights}</div>
      <div>sumOfProducts: {sumOfProducts}</div>
      <div>inputCalc: {inputCalc}</div>
      <div>certaintyCalc: {certaintyCalc}</div>
      <div>averageScoreCalc: {averageScoreCalc}</div>
      <div>influenceCalc: {influenceCalc}</div>
      <div>aMutedBy length: {aMutedBy.length}</div>
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
        <CRow>
          <div>aFollowers length: {aFollowers.length}</div>
          <div style={{ height: '300px', overflow: 'scroll' }}>
            <CCol>
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
                  {aFollowers.map((pubkey, item) => {
                    const oProfileBrainstorm = getProfileBrainstormFromPubkey(pubkey, oProfilesByNpub)
                    const raterInfluence_ = oProfileBrainstorm.wotScores.baselineInfluence.influence
                    const rating_ = followInterpretationScore_
                    const ratingConfidence_ = followInterpretationConfidence_
                    let weight = (rating_ * attenuationFactor_ * raterInfluence_ * ratingConfidence_).toPrecision(4)
                    if (pubkey == myPubkey) {
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
                  })}
                </CTableBody>
              </CTable>
            </CCol>
          </div>
        </CRow>
      </CContainer>
    </>
  )
}

export default InfluenceScores
