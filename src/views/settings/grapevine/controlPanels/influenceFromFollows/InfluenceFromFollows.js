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
} from '@coreui/react'

const InfluenceFromFollowsControlPanel = () => {
  const [attenuationFactor, setAttenuationFactor] = useState('80')

  const defAttFac = 80
  const defDefScore = 0
  const defDefCon = 10
  const defFollInterpScore = 100
  const defFollInterpCon = 80
  const defMuteInterpScore = 0
  const defMuteInterpCon = 80

  const [defaultScore, setDefaultScore] = useState(defDefScore)
  const [defaultConfidence, setDefaultConfidence] = useState(defDefCon)

  const [followInterpretationScore, setFollowInterpretationScore] = useState(defFollInterpScore)
  const [followInterpretationConfidence, setFollowInterpretationConfidence] =
    useState(defFollInterpCon)

  const [muteInterpretationScore, setMuteInterpretationScore] = useState(defMuteInterpScore)
  const [muteInterpretationConfidence, setMuteInterpretationConfidence] = useState(defMuteInterpCon)

  const updateAttenuationFactor = useCallback(async (newValue) => {
    setAttenuationFactor(newValue)
  }, [])

  const updateDefaultScore = useCallback(async (newValue) => {
    setDefaultScore(newValue)
  }, [])
  const updateDefaultConfidence = useCallback(async (newValue) => {
    setDefaultConfidence(newValue)
  }, [])

  const updateFollowInterpretationScore = useCallback(async (newValue) => {
    setFollowInterpretationScore(newValue)
  }, [])
  const updateFollowInterpretationConfidence = useCallback(async (newValue) => {
    setFollowInterpretationConfidence(newValue)
  }, [])

  const updateMuteInterpretationScore = useCallback(async (newValue) => {
    setMuteInterpretationScore(newValue)
  }, [])
  const updateMuteInterpretationConfidence = useCallback(async (newValue) => {
    setMuteInterpretationConfidence(newValue)
  }, [])
  return (
    <>
      <center>
        <h4>Calculation of Influence from Follows Control Panel</h4>
      </center>
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
              <strong>Default Attenuation Factor</strong>
            </CCardHeader>
            <CCardBody>
              <CFormLabel htmlFor="scoreScrollbar">
                <strong>Select Attenuation Factor</strong>{' '}
                <small>range: from 0 (most conservative) to 100 (most trusting)</small>
              </CFormLabel>
              <CCardTitle>{attenuationFactor}</CCardTitle>
              <CFormRange
                onChange={(e) => updateAttenuationFactor(e.target.value)}
                min={0}
                max={100}
                step={1}
                defaultValue={defAttFac}
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
                onChange={(e) => updateDefaultScore(e.target.value)}
                min={0}
                max={100}
                step={1}
                defaultValue={defDefScore}
                id="scoreScrollbar"
              />
              <br />
              <CFormLabel htmlFor="confidenceScrollbar">
                <strong>Select confidence (%)</strong>{' '}
                <small>range: from 0 (no confidence) to 100 (full confidence)</small>
              </CFormLabel>
              <CCardTitle>{defaultConfidence} %</CCardTitle>
              <CFormRange
                onChange={(e) => updateDefaultConfidence(e.target.value)}
                min={0}
                max={100}
                step={1}
                defaultValue={defDefCon}
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
                onChange={(e) => updateFollowInterpretationScore(e.target.value)}
                min={0}
                max={100}
                step={1}
                defaultValue={defFollInterpScore}
                id="scoreScrollbar"
              />
              <br />
              <CFormLabel htmlFor="confidenceScrollbar">
                <strong>Select confidence (%)</strong>{' '}
                <small>range: from 0 (no confidence) to 100 (full confidence)</small>
              </CFormLabel>
              <CCardTitle>{followInterpretationConfidence} %</CCardTitle>
              <CFormRange
                onChange={(e) => updateFollowInterpretationConfidence(e.target.value)}
                min={0}
                max={100}
                step={1}
                defaultValue={defFollInterpCon}
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
                onChange={(e) => updateMuteInterpretationScore(e.target.value)}
                min={0}
                max={100}
                step={1}
                defaultValue={defMuteInterpScore}
                id="scoreScrollbar"
              />
              <br />
              <CFormLabel htmlFor="confidenceScrollbar">
                <strong>Select confidence (%)</strong>{' '}
                <small>range: from 0 (no confidence) to 100 (full confidence)</small>
              </CFormLabel>
              <CCardTitle>{muteInterpretationConfidence} %</CCardTitle>
              <CFormRange
                onChange={(e) => updateMuteInterpretationConfidence(e.target.value)}
                min={0}
                max={100}
                step={1}
                defaultValue={defMuteInterpCon}
                id="confidenceScrollbar"
              />
            </CCardBody>
          </CCard>
          <CButton color="primary">Reset parameters to recommended values</CButton>
        </CCol>
      </CRow>
    </>
  )
}

export default InfluenceFromFollowsControlPanel
