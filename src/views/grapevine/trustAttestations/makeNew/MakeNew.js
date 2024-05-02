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
  CNavLink,
} from '@coreui/react'
import { fetchFirstByTag } from '../../../../helpers'
import { signEventPGA } from '../../../../helpers/signers'
import { useSelector } from 'react-redux'
import RateeProfile from './rateeProfile'
import { nip19 } from 'nostr-tools'
import { useNostr } from 'nostr-react'
import ContextSelector from '../../components/contextSelector'

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
  if (!contextEvent) {
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

const MakeNewTrustAttestation = () => {
  const defaultRateeNpub = useSelector((state) => state.siteNavigation.npub)
  const oContexts = useSelector((state) => state.grapevine.contexts)
  const oProfile = useSelector((state) => state.profile)
  const [rateeNpub, setRateeNpub] = useState(defaultRateeNpub)
  const [score, setScore] = useState('100')
  const [confidence, setConfidence] = useState('80')
  const [comments, setComments] = useState('')
  const [selectedContext, setSelectedContext] = useState('')
  const [oEvent, setOEvent] = useState(oEventDefault)
  const [showRawDataButton, setShowRawDataButton] = useState('hide')
  const [submitEventButtonClassName, setSubmitEventButtonClassName] = useState('mt-3')
  const [createAnotherElementClassName, setCreateAnotherElementClassName] = useState('hide')

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
  const handleRateeNpubChange = useCallback(
    async (e) => {
      const newRateeNpub = e.target.value
      setRateeNpub(newRateeNpub)
      const oEvent = await makeWord(
        oProfile,
        oContexts,
        newRateeNpub,
        score,
        confidence,
        selectedContext,
        comments,
      )
      setOEvent(oEvent)
    },
    [score, rateeNpub, confidence, selectedContext, comments],
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
    [score, rateeNpub, confidence, selectedContext, comments],
  )
  const clearFields = useCallback(async (e) => {
    setRateeNpub('')
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
    [score, rateeNpub, confidence, selectedContext, comments],
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
    [score, rateeNpub, confidence, selectedContext, comments],
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
    [score, rateeNpub, confidence, selectedContext, comments],
  )
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Make New Trust Attestation</strong>
          </CCardHeader>
          <CCardBody>
            <CForm>
              <RateeProfile npub={rateeNpub} />
              <br />
              <CFormInput
                type="text"
                id="rateeNpub"
                label="npub"
                placeholder="npub ..."
                required
                value={rateeNpub}
                onChange={handleRateeNpubChange}
              />
              <br />
              <CFormLabel htmlFor="scoreScrollbar">
                <strong>Select score</strong>{' '}
                <small>range: from 0 (do not trust) to 100 (trust fully)</small>
              </CFormLabel>
              <CCardTitle>{score}</CCardTitle>
              <CFormRange
                onChange={(e) => updateScore(e.target.value)}
                min={0}
                max={100}
                step={1}
                defaultValue="100"
                id="scoreScrollbar"
              />
              <br />
              <CFormLabel htmlFor="confidenceScrollbar">
                <strong>Select confidence (%)</strong>{' '}
                <small>range: from 0 (no confidence) to 100 (full confidence)</small>
              </CFormLabel>
              <CCardTitle>{confidence} %</CCardTitle>
              <CFormRange
                onChange={(e) => updateConfidence(e.target.value)}
                min={0}
                max={100}
                step={1}
                defaultValue="80"
                id="confidenceScrollbar"
              />
              <ContextSelector updateSelectedContext={updateSelectedContext} />
              <br />
              <CFormTextarea
                type="text"
                id="comments"
                rows={3}
                label="comments"
                placeholder="lorem ipsum"
                value={comments}
                onChange={handleCommentsChange}
              />
            </CForm>
            <br />
            <CButton
              color="primary"
              className={submitEventButtonClassName}
              id="submitEventButton"
              active
              tabIndex={-1}
              onClick={publishNewEvent}
            >
              Submit (currently disabled)
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

export default MakeNewTrustAttestation
