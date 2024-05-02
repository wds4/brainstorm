import React, { useCallback, useState } from 'react'
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
  CContainer,
  CCardText,
} from '@coreui/react'
import { fetchFirstByTag } from 'src/helpers'
import { signEventPGA } from 'src/helpers/signers'
import { useSelector } from 'react-redux'
import { nip19 } from 'nostr-tools'
import { useNostr } from 'nostr-react'
import ContextSelector from './contextSelector'
import { cilThumbDown, cilThumbUp } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const ShowExistingAttestation = ({
  existingAttestationScore,
  existingAttestationConfidence,
  existingAttestationComments,
}) => {
  let showExistingAttestationClassName = 'show'
  let existingScoreText = 'no attestation'
  let existingConfidenceText = ''
  const existingCommentsText = existingAttestationComments
  if (existingAttestationScore == '') {
    showExistingAttestationClassName = 'hide'
  }

  const processRevokeButtonClick = useCallback(async () => {
    console.log('processRevokeButtonClick')
  }, [])
  return (
    <div className={showExistingAttestationClassName}>
      <br />
      <div style={{ color: 'grey' }}>your current rating of this user in this context:</div>
      <CCardText style={{ textAlign: 'center' }}>
        <div className="d-flex w-100 justify-content-between">
          <span style={{ fontSize: '28px' }}>{existingScoreText}</span>{' '}
          <span style={{ fontSize: '20px' }}>{existingConfidenceText} % confidence</span>
        </div>
      </CCardText>
      <CButton type="button" color="secondary" onClick={processRevokeButtonClick}>
        Revoke this rating
      </CButton>
    </div>
  )
}

// eslint-disable-next-line react/prop-types
const RawData = ({ showRawDataButton, oEvent }) => {
  if (showRawDataButton == 'hide') {
    return <></>
  }
  const sWord = fetchFirstByTag('word', oEvent)
  const oWord = JSON.parse(sWord)
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>raw tapestry word</strong>
        </CCardHeader>
        <CCardBody>
          <pre>{JSON.stringify(oWord, null, 4)}</pre>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>raw nostr event</strong>
        </CCardHeader>
        <CCardBody>
          <pre>{JSON.stringify(oEvent, null, 4)}</pre>
        </CCardBody>
      </CCard>
    </>
  )
}

const oEventDefault = {
  content: '',
  kind: 39902,
  tags: [
    ['P', 'tapestry'],
    ['word', '{}'],
    ['wordType', 'trustAttestation'],
    ['w', 'trustAttestation'],
    ['d', ''],
    ['p', ''],
    ['c', ''],
    ['transitive', 'true'],
    ['score', ''],
    ['confidence', ''],
  ],
  created_at: null,
}

async function makeWord(
  oProfile,
  oContexts,
  rateeNpub,
  score,
  confidence,
  selectedContext,
  comments,
) {
  const result = nip19.decode(rateeNpub)
  let pubkey = ''
  if (result.type == 'npub') {
    pubkey = result.data
  }
  const contextEvent = oContexts[selectedContext]
  let contextName = fetchFirstByTag('name', contextEvent)
  if (selectedContext == 'unselected') {
    contextName = ''
  }
  if (selectedContext == 'inAllContexts') {
    contextName = 'for all contexts'
  }
  const oWord = {
    trustAttestationData: {
      rater: {
        pubkey: oProfile.pubkey,
        npub: oProfile.npub,
      },
      ratee: {
        pubkey: pubkey,
        npub: rateeNpub,
      },
      score: score,
      confidence: confidence,
      comments: comments,
      context: {
        eventId: contextEvent?.id,
        naddr: '',
        name: contextName,
        transitive: true,
      },
    },
  }
  if (contextEvent && contextEvent.kind >= 30000 && contextEvent.kind < 40000) {
    oWord.trustAttestationData.context.naddr = selectedContext
  }
  const sWord = JSON.stringify(oWord)
  let oEvent = oEventDefault
  oEvent.content = comments
  oEvent.kind = 39902
  const tags = [
    ['P', 'tapestry'],
    ['word', sWord],
    ['wordType', 'trustAttestation'],
    ['w', 'trustAttestation'],
    ['d', pubkey + '/' + selectedContext],
    ['p', pubkey],
    ['c', selectedContext],
    ['transitive', 'true'],
    ['score', score],
    ['confidence', confidence],
  ]
  oEvent.tags = tags
  oEvent.created_at = Math.floor(Date.now() / 1000)
  const oEvent_signed = await signEventPGA(oProfile, oEvent)
  return oEvent_signed
}

// eslint-disable-next-line react/prop-types
const LeaveTrustAttestation = ({ rateeNpub }) => {
  const oContexts = useSelector((state) => state.grapevine.contexts)
  const oProfile = useSelector((state) => state.profile)
  const [score, setScore] = useState('')
  const [confidence, setConfidence] = useState('80')
  const [comments, setComments] = useState('')
  const [selectedContext, setSelectedContext] = useState('')
  const [oEvent, setOEvent] = useState(oEventDefault)
  const [showRawDataButton, setShowRawDataButton] = useState('hide')
  const [submitEventButtonClassName, setSubmitEventButtonClassName] = useState('mt-3')
  const [createAnotherElementClassName, setCreateAnotherElementClassName] = useState('hide')

  const [existingAttestationScore, setExistingAttestationScore] = useState('')
  const [existingAttestationConfidence, setExistingAttestationConfidence] = useState('')
  const [existingAttestationComments, setExistingAttestationComments] = useState('')

  const [endorseButtonColor, setEndorseButtonColor] = useState('secondary')
  const [blockButtonColor, setBlockButtonColor] = useState('secondary')

  const { publish } = useNostr()

  const publishNewEvent = useCallback(async () => {
    // publish(oEvent)
    setSubmitEventButtonClassName('hide')
    setCreateAnotherElementClassName('show')
  }, [selectedContext, oEvent])
  const createAnotherContextButton = useCallback(() => {
    setSubmitEventButtonClassName('mt-3')
    setCreateAnotherElementClassName('hide')
    clearFields()
  }, [selectedContext, oEvent])
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
  const handleCommentsChange = useCallback(
    async (e) => {
      const newComments = e.target.value
      setComments(newComments)
      const oEvent = await makeWord(
        oProfile,
        oContexts,
        rateeNpub,
        score,
        confidence,
        selectedContext,
        newComments,
      )
      setOEvent(oEvent)
    },
    [score, confidence, selectedContext, comments],
  )
  const clearFields = useCallback(async (e) => {
    setScore('100'), setConfidence('80')
    setComments('')
    setSelectedContext('')
    const oEvent = await makeWord(oProfile, oContexts, '', '', '', '', '')
    setOEvent(oEvent)
  }, [])
  const updateSelectedContext = useCallback(
    async (newSelectedContext) => {
      setSelectedContext(newSelectedContext)
      const oEvent = await makeWord(
        oProfile,
        oContexts,
        rateeNpub,
        score,
        confidence,
        newSelectedContext,
        comments,
      )
      setOEvent(oEvent)
    },
    [score, confidence, selectedContext, comments],
  )
  const updateScore = useCallback(
    async (newScore) => {
      console.log('newScore: ' + newScore)
      setScore(newScore)
      const oEvent = await makeWord(
        oProfile,
        oContexts,
        rateeNpub,
        newScore,
        confidence,
        selectedContext,
        comments,
      )
      setOEvent(oEvent)
    },
    [score, confidence, selectedContext, comments],
  )
  const updateConfidence = useCallback(
    async (newConfidence) => {
      console.log('newConfidence: ' + newConfidence)
      setConfidence(newConfidence)
      const oEvent = await makeWord(
        oProfile,
        oContexts,
        rateeNpub,
        score,
        newConfidence,
        selectedContext,
        comments,
      )
      setOEvent(oEvent)
    },
    [score, confidence, selectedContext, comments],
  )
  const processEndorseButtonClick = useCallback(async () => {
    console.log('processEndorseButtonClick: ')
    updateScore('100')
    setEndorseButtonColor('success')
    setBlockButtonColor('secondary')
  }, [])
  const processBlockButtonClick = useCallback(async () => {
    console.log('processBlockButtonClick: ')
    updateScore('0')
    setEndorseButtonColor('secondary')
    setBlockButtonColor('danger')
  }, [])
  let isSubmitAttestationButtonDisabled = true
  if (selectedContext && (score == '0' || score == '100')) {
    isSubmitAttestationButtonDisabled = false
  }
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Make New Trust Attestation</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <div className="d-grid gap-2 mx-auto">
                <div className="d-grid gap-2 col-8 mx-auto">
                  <ContextSelector updateSelectedContext={updateSelectedContext} />
                  <CButton
                    type="button"
                    color={endorseButtonColor}
                    onClick={processEndorseButtonClick}
                  >
                    <CIcon icon={cilThumbUp} /> Endorse
                  </CButton>
                  <CButton type="button" color={blockButtonColor} onClick={processBlockButtonClick}>
                    <CIcon icon={cilThumbDown} /> Block
                  </CButton>
                  <CFormTextarea
                    type="text"
                    id="comments"
                    rows={3}
                    placeholder="leave comments (optional)"
                    value={comments}
                    onChange={handleCommentsChange}
                  />
                  <CButton
                    color="primary"
                    className={submitEventButtonClassName}
                    id="submitEventButton"
                    onClick={publishNewEvent}
                    disabled={isSubmitAttestationButtonDisabled}
                  >
                    Submit Trust Attestation (currently disabled)
                  </CButton>
                  <div className={createAnotherElementClassName}>
                    <br />
                    <CCardTitle>Your trust attestation has been published!</CCardTitle>
                    <CButton
                      color="primary"
                      id="createAnotherEventButton"
                      onClick={createAnotherContextButton}
                    >
                      Create another trust attestation
                    </CButton>
                  </div>
                  <ShowExistingAttestation
                    existingAttestationScore={existingAttestationScore}
                    existingAttestationConfidence={existingAttestationConfidence}
                    existingAttestationComments={existingAttestationComments}
                  />
                </div>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'inline-block' }}>
            <CFormSwitch
              onChange={(e) => toggleShowRawData(e)}
              label="raw JSON"
              id="formSwitchCheckDefault"
            />
          </div>
        </div>
        <RawData showRawDataButton={showRawDataButton} oEvent={oEvent} />
      </CCol>
    </CRow>
  )
}

export default LeaveTrustAttestation
