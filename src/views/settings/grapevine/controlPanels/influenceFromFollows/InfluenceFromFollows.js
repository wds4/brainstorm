import React, { useCallback, useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormInput,
  CFormSwitch,
  CFormTextarea,
  CCardTitle,
  CFormLabel,
  CFormRange,
  CNavLink,
  CFormSelect,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateAttenuationFactor,
  updateDefaultUserConfidence,
  updateDefaultUserScore,
  updateDunbarNumber,
  updateFollowInterpretationConfidence,
  updateFollowInterpretationScore,
  updateMuteInterpretationConfidence,
  updateMuteInterpretationScore,
  updateRigor,
  wipeGrapevine,
} from '../../../../../redux/features/grapevine/slice'
import InfluenceCalculations from './influenceCalculations'
import {
  defAttFac,
  defDunbarNumber,
  defDefScore,
  defDefCon,
  defFollInterpScore,
  defFollInterpCon,
  defMuteInterpScore,
  defMuteInterpCon,
  defRigor,
} from '../../../../../const'

const InfluenceFromFollowsControlPanel = () => {
  const dispatch = useDispatch()

  const dunbarNumberState = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.dunbarNumber),
  )
  const attenuationFactorState = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.attenuationFactor),
  )
  const rigorState = Number(useSelector((state) => state.grapevine.controlPanels.baseLayer.rigor))
  const defaultUserScoreState = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.defaultUserScore.score),
  )
  const defaultUserConfidenceState = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.defaultUserScore.confidence),
  )

  const followInterpretationScoreState = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.followInterpretation.score),
  )
  const followInterpretationConfidenceState = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.followInterpretation.confidence),
  )

  const muteInterpretationScoreState = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.muteInterpretation.score),
  )
  const muteInterpretationConfidenceState = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.muteInterpretation.confidence),
  )

  const [dunbarNumber, setDunbarNumber] = useState(dunbarNumberState)
  const [attenuationFactor, setAttenuationFactor] = useState(attenuationFactorState)
  const [rigor, setRigor] = useState(rigorState)

  const [defaultScore, setDefaultScore] = useState(defaultUserScoreState)
  const [defaultConfidence, setDefaultConfidence] = useState(defaultUserConfidenceState)

  const [followInterpretationScore, setFollowInterpretationScore] = useState(
    followInterpretationScoreState,
  )
  const [followInterpretationConfidence, setFollowInterpretationConfidence] = useState(
    followInterpretationConfidenceState,
  )

  const [muteInterpretationScore, setMuteInterpretationScore] = useState(
    muteInterpretationScoreState,
  )
  const [muteInterpretationConfidence, setMuteInterpretationConfidence] = useState(
    muteInterpretationConfidenceState,
  )

  const changeDunbarNumber = useCallback(async (newValue) => {
    setDunbarNumber(newValue)
    dispatch(updateDunbarNumber(newValue))
  }, [])
  const changeAttenuationFactor = useCallback(async (newValue) => {
    setAttenuationFactor(newValue)
    dispatch(updateAttenuationFactor(newValue))
  }, [])
  const changeRigor = useCallback(async (newValue) => {
    setRigor(newValue)
    dispatch(updateRigor(newValue))
  }, [])
  const changeDefaultScore = useCallback(async (newValue) => {
    setDefaultScore(newValue)
    dispatch(updateDefaultUserScore(newValue))
  }, [])
  const changeDefaultConfidence = useCallback(async (newValue) => {
    setDefaultConfidence(newValue)
    dispatch(updateDefaultUserConfidence(newValue))
  }, [])
  const changeFollowInterpretationScore = useCallback(async (newValue) => {
    setFollowInterpretationScore(newValue)
    dispatch(updateFollowInterpretationScore(newValue))
  }, [])
  const changeFollowInterpretationConfidence = useCallback(async (newValue) => {
    setFollowInterpretationConfidence(newValue)
    dispatch(updateFollowInterpretationConfidence(newValue))
  }, [])
  const changeMuteInterpretationScore = useCallback(async (newValue) => {
    setMuteInterpretationScore(newValue)
    dispatch(updateMuteInterpretationScore(newValue))
  }, [])
  const changeMuteInterpretationConfidence = useCallback(async (newValue) => {
    setMuteInterpretationConfidence(newValue)
    dispatch(updateMuteInterpretationConfidence(newValue))
  }, [])
  const resetParameters = () => {
    dispatch(wipeGrapevine())
    changeDunbarNumber(defDunbarNumber)
    changeAttenuationFactor(defAttFac)
    changeRigor(defRigor)
    changeDefaultScore(defDefScore)
    changeDefaultConfidence(defDefCon)
    changeFollowInterpretationScore(defFollInterpScore)
    changeFollowInterpretationConfidence(defFollInterpCon)
    changeMuteInterpretationScore(defMuteInterpScore)
    changeMuteInterpretationConfidence(defMuteInterpCon)
  }
  return (
    <>
      <center>
        <h4>Calculation of Influence from Follows Control Panel</h4>
      </center>
      <br />
      <InfluenceCalculations />
      <br />
      <CRow>
        <div>
          These values will be used to calculate an Influence Score using follow (and potentiall
          mute) data, according to the methods of the tapestry protocol, and as already demonstrated
          in the Pretty Good Apps desktop nostr client. Once complete, you will be able to use the
          Influence Score in place of Degree of Separation to stratify Wiki articles and other
          content.
        </div>
      </CRow>
      <br />
      <CRow>
        <div>
          Next, users will be enabled to issue contextual Trust Attestations, which will take the
          place of follows and mutes as the data becomes available.
        </div>
      </CRow>
      <br />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Dunbar Number</strong>
            </CCardHeader>
            <CCardBody>
              <CFormLabel htmlFor="scoreScrollbar">
                The maximum number of profiles to keep track of at once. Determined as the top N
                most trusted at the foundational trust layer. Decrease if / when performance becomes
                a problem.
              </CFormLabel>
              <CCardTitle>{dunbarNumber}</CCardTitle>
              <CFormInput
                onChange={(e) => changeDunbarNumber(e.target.value)}
                value={dunbarNumber}
              ></CFormInput>
            </CCardBody>
          </CCard>

          <CCard className="mb-4">
            <CCardHeader>
              <strong>Default Attenuation Factor</strong>
            </CCardHeader>
            <CCardBody>
              <CFormLabel htmlFor="scoreScrollbar">
                <strong>Attenuation Factor</strong>{' '}
                <small>range: from 0 (most conservative) to 100 (most trusting)</small>
              </CFormLabel>
              <CCardTitle>{attenuationFactor}</CCardTitle>
              <CFormRange
                onChange={(e) => changeAttenuationFactor(e.target.value)}
                min={0}
                max={100}
                step={1}
                value={attenuationFactor}
                id="scoreScrollbar"
              />
            </CCardBody>
          </CCard>

          <CCard className="mb-4">
            <CCardHeader>
              <strong>Rigor</strong>
            </CCardHeader>
            <CCardBody>
              <CFormLabel htmlFor="scoreScrollbar">
                <strong>Rigor</strong>{' '}
                <small>range: from 0 (most lax) to 100 (most strict)</small>
              </CFormLabel>
              <CCardTitle>{rigor}</CCardTitle>
              <CFormRange
                onChange={(e) => changeRigor(e.target.value)}
                min={0}
                max={100}
                step={1}
                value={rigor}
                id="scoreScrollbar"
              />
            </CCardBody>
          </CCard>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Default User Scores</strong>
            </CCardHeader>
            <CCardBody>
              <CFormLabel htmlFor="scoreScrollbar">
                <strong>Select score</strong>{' '}
                <small>range: from 0 (do not trust) to 100 (trust fully)</small>
              </CFormLabel>
              <CCardTitle>{defaultScore}</CCardTitle>
              <CFormRange
                onChange={(e) => changeDefaultScore(e.target.value)}
                min={0}
                max={100}
                step={1}
                value={defaultScore}
                id="scoreScrollbar"
              />
              <br />
              <CFormLabel htmlFor="confidenceScrollbar">
                <strong>Select confidence (%)</strong>{' '}
                <small>range: from 0 (no confidence) to 100 (full confidence)</small>
              </CFormLabel>
              <CCardTitle>{defaultConfidence} %</CCardTitle>
              <CFormRange
                onChange={(e) => changeDefaultConfidence(e.target.value)}
                min={0}
                max={100}
                step={1}
                value={defaultConfidence}
                id="confidenceScrollbar"
              />
            </CCardBody>
          </CCard>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Interpretation of a Follow</strong>
            </CCardHeader>
            <CCardBody>
              <CFormLabel htmlFor="scoreScrollbar">
                <strong>Select score</strong>{' '}
                <small>range: from 0 (do not trust) to 100 (trust fully)</small>
              </CFormLabel>
              <CCardTitle>{followInterpretationScore}</CCardTitle>
              <CFormRange
                onChange={(e) => changeFollowInterpretationScore(e.target.value)}
                min={0}
                max={100}
                step={1}
                value={followInterpretationScore}
                id="scoreScrollbar"
              />
              <br />
              <CFormLabel htmlFor="confidenceScrollbar">
                <strong>Select confidence (%)</strong>{' '}
                <small>range: from 0 (no confidence) to 100 (full confidence)</small>
              </CFormLabel>
              <CCardTitle>{followInterpretationConfidence} %</CCardTitle>
              <CFormRange
                onChange={(e) => changeFollowInterpretationConfidence(e.target.value)}
                min={0}
                max={100}
                step={1}
                value={followInterpretationConfidence}
                id="confidenceScrollbar"
              />
            </CCardBody>
          </CCard>

          <CCard className="mb-4">
            <CCardHeader>
              <strong>Interpretation of a Mute</strong>
            </CCardHeader>
            <CCardBody>
              <CFormLabel htmlFor="scoreScrollbar">
                <strong>Select score</strong>{' '}
                <small>range: from 0 (do not trust) to 100 (trust fully)</small>
              </CFormLabel>
              <CCardTitle>{muteInterpretationScore}</CCardTitle>
              <CFormRange
                onChange={(e) => changeMuteInterpretationScore(e.target.value)}
                min={0}
                max={100}
                step={1}
                value={muteInterpretationScore}
                id="scoreScrollbar"
              />
              <br />
              <CFormLabel htmlFor="confidenceScrollbar">
                <strong>Select confidence (%)</strong>{' '}
                <small>range: from 0 (no confidence) to 100 (full confidence)</small>
              </CFormLabel>
              <CCardTitle>{muteInterpretationConfidence} %</CCardTitle>
              <CFormRange
                onChange={(e) => changeMuteInterpretationConfidence(e.target.value)}
                min={0}
                max={100}
                step={1}
                value={muteInterpretationConfidence}
                id="confidenceScrollbar"
              />
            </CCardBody>
          </CCard>
          <CButton color="primary" onClick={resetParameters}>
            Reset parameters to recommended values
          </CButton>
        </CCol>
      </CRow>
      <br />
    </>
  )
}

export default InfluenceFromFollowsControlPanel
