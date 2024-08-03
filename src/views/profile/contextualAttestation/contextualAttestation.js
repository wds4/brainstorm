import { cilThumbDown, cilThumbUp } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CForm, CPopover } from '@coreui/react'
import { useNostr } from 'nostr-react'
import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import CategorySelector from './categorySelector'

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
  ],
  created_at: null,
}

async function makeWord(oMyProfile, oContexts, rateeNpub, score, selectedContext) {
  const oEvent_signed = { foo: 'bar' }
  return oEvent_signed
}

// eslint-disable-next-line react/prop-types
const ContextualFollowMuteButtons = ({ rateeNpub }) => {
  const oMyProfile = useSelector((state) => state.profile)
  const oContexts = useSelector((state) => state.grapevine.contexts)

  const [score, setScore] = useState('')
  const [selectedContext, setSelectedContext] = useState('')
  const [oEvent, setOEvent] = useState(oEventDefault)

  const [muteButtonColor, setMuteButtonColor] = useState('secondary')
  const [followButtonColor, setFollowButtonColor] = useState('secondary')
  const [superfollowButtonColor, setSuperfollowButtonColor] = useState('secondary')

  const { publish } = useNostr()

  const updateScore = useCallback(
    async (newScore) => {
      setScore(newScore)
      const oEvent = await makeWord(oMyProfile, oContexts, rateeNpub, newScore, selectedContext)
      setOEvent(oEvent)
    },
    [score, selectedContext],
  )
  const updateSelectedContext = useCallback(
    async (newSelectedContext) => {
      setSelectedContext(newSelectedContext)
      const oEvent = await makeWord(oMyProfile, oContexts, rateeNpub, score, newSelectedContext)
      setOEvent(oEvent)
    },
    [score, selectedContext],
  )
  const processFollowButtonClick = useCallback(async () => {
    updateScore('100')
    setFollowButtonColor('success')
    setMuteButtonColor('secondary')
    setSuperfollowButtonColor('secondary')
  }, [score, selectedContext])

  const processMuteButtonClick = useCallback(async () => {
    updateScore('0')
    setFollowButtonColor('secondary')
    setMuteButtonColor('danger')
    setSuperfollowButtonColor('secondary')
  }, [score, selectedContext])

  const processSuperfollowButtonClick = useCallback(async () => {
    updateScore('0')
    setFollowButtonColor('secondary')
    setMuteButtonColor('secondary')
    setSuperfollowButtonColor('primary')
  }, [score, selectedContext])

  return (
    <>
      <CForm>
        <div className="d-flex gap-2">
          <CPopover content="mute (block)" placement="top" trigger={['hover', 'focus']}>
            <CButton type="button" color={muteButtonColor} onClick={processMuteButtonClick}>
              👎
            </CButton>
          </CPopover>
          <CPopover content="follow (endorse)" placement="top" trigger={['hover', 'focus']}>
            <CButton type="button" color={followButtonColor} onClick={processFollowButtonClick}>
              👍
            </CButton>
          </CPopover>
          <CPopover
            content="superfollow (superendorse)"
            placement="top"
            trigger={['hover', 'focus']}
          >
            <CButton
              type="button"
              color={superfollowButtonColor}
              onClick={processSuperfollowButtonClick}
            >
              🔥
            </CButton>
          </CPopover>
          <CategorySelector updateSelectedContext={updateSelectedContext} />
        </div>
      </CForm>
    </>
  )
}

export default ContextualFollowMuteButtons
