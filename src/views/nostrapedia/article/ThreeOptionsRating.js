import React, { useCallback, useState } from 'react'
import { CButton, CPopover } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFire, cilInfo, cilThumbDown, cilThumbUp } from '@coreui/icons'

const ThreeOptionsRating = () => {
  const [muteButtonColor, setMuteButtonColor] = useState('light')
  const [followButtonColor, setFollowButtonColor] = useState('light')
  const [superfollowButtonColor, setSuperfollowButtonColor] = useState('light')

  const processMuteButtonClick = useCallback(async () => {
    // updateScore('0')
    setFollowButtonColor('light')
    setMuteButtonColor('danger')
    setSuperfollowButtonColor('light')
  }, [])
  const processFollowButtonClick = useCallback(async () => {
    // updateScore('100')
    setFollowButtonColor('success')
    setMuteButtonColor('light')
    setSuperfollowButtonColor('light')
  }, [])

  const processSuperfollowButtonClick = useCallback(async () => {
    // updateScore('0')
    setFollowButtonColor('light')
    setMuteButtonColor('light')
    setSuperfollowButtonColor('primary')
  }, [])

  const MuteButton = ({ muteButtonColor }) => {
    if (muteButtonColor == 'light') {
      return (
        <>
          <CIcon icon={cilThumbDown} size="lg" />
        </>
      )
    }
    if (muteButtonColor == 'danger') {
      return <>👎</>
    }
    return <></>
  }

  const FollowButton = ({ followButtonColor }) => {
    if (followButtonColor == 'light') {
      return (
        <>
          <CIcon icon={cilThumbUp} size="lg" />
        </>
      )
    }
    if (followButtonColor == 'success') {
      return <>👍</>
    }
    return <></>
  }

  const SuperfollowButton = ({ superfollowButtonColor }) => {
    if (superfollowButtonColor == 'light') {
      return (
        <>
          <CIcon icon={cilFire} size="lg" />
        </>
      )
    }
    if (superfollowButtonColor == 'primary') {
      return <>🔥</>
    }
    return <></>
  }
  return (
    <>
      <div>
        <span>Do you like this article? </span>
        <CButton
          id="muteButtonElem"
          type="button"
          color={muteButtonColor}
          onClick={processMuteButtonClick}
        >
          <MuteButton muteButtonColor={muteButtonColor} />
        </CButton>
        <CButton
          type="button"
          color={followButtonColor}
          onClick={processFollowButtonClick}
          style={{ marginLeft: '5px' }}
        >
          <FollowButton followButtonColor={followButtonColor} />
        </CButton>
        <CButton
          type="button"
          color={superfollowButtonColor}
          onClick={processSuperfollowButtonClick}
          style={{ marginLeft: '5px' }}
        >
          <SuperfollowButton superfollowButtonColor={superfollowButtonColor} />
        </CButton>
        <span style={{ color: 'grey', marginLeft: '5px' }}>
          <CPopover
            content="rate this author in this category"
            placement="left"
            trigger={['hover', 'focus']}
          >
            <CIcon icon={cilInfo} size="lg" />
          </CPopover>
        </span>
      </div>
    </>
  )
}

export default ThreeOptionsRating
