import React, { useEffect, useState } from 'react'
import { CNav, CNavLink } from '@coreui/react'
import { useSelector } from 'react-redux'

// eslint-disable-next-line react/prop-types
const TabsNavigation = ({ whichTab, updateWhichTab }) => {
  const developmentMode = useSelector((state) => state.settings.general.developmentMode)
  const isTab = (queryTab) => {
    if (whichTab == queryTab) {
      return true
    }
    return false
  }
  const [isAbout, setIsAbout] = useState(isTab('about'))
  const [isFollows, setIsFollows] = useState(isTab('follows'))
  const [isNotes, setIsNotes] = useState(isTab('notes'))
  const [isWikis, setIsWikis] = useState(isTab('wikis'))
  const [isLeaveRating, setIsLeaveRating] = useState(isTab('leaveRating'))
  const [isRatingsOf, setIsRatingsOf] = useState(isTab('ratingsOf'))
  const [isRatingsBy, setIsRatingsBy] = useState(isTab('ratingsBy'))
  const [isWotScores, setIsWotScores] = useState(isTab('wotScores'))

  const setAllOptionsToFalse = () => {
    setIsAbout(false)
    setIsFollows(false)
    setIsNotes(false)
    setIsWikis(false)
    setIsLeaveRating(false)
    setIsRatingsOf(false)
    setIsRatingsBy(false)
    setIsWotScores(false)
  }

  const setActiveTabAbout = () => {
    setAllOptionsToFalse()
    setIsAbout(true)
    updateWhichTab('about')
  }
  const setActiveTabFollows = () => {
    setAllOptionsToFalse()
    setIsFollows(true)
    updateWhichTab('follows')
  }
  const setActiveTabNotes = () => {
    setAllOptionsToFalse()
    setIsNotes(true)
    updateWhichTab('notes')
  }
  const setActiveTabWikis = () => {
    setAllOptionsToFalse()
    setIsWikis(true)
    updateWhichTab('wikis')
  }
  const setActiveTabLeaveRating = () => {
    setAllOptionsToFalse()
    setIsLeaveRating(true)
    updateWhichTab('leaveRating')
  }
  const setActiveTabRatingsOf = () => {
    setAllOptionsToFalse()
    setIsRatingsOf(true)
    updateWhichTab('ratingsOf')
  }
  const setActiveTabRatingsBy = () => {
    setAllOptionsToFalse()
    setIsRatingsBy(true)
    updateWhichTab('ratingsBy')
  }
  const setActiveTabWotScores = () => {
    setAllOptionsToFalse()
    setIsWotScores(true)
    updateWhichTab('wotScores')
  }

  // this is needed bc follows tab can be changed from main profile page
  // no need to do this for other tabs
  useEffect(() => {
    if (whichTab == 'follows') {
      setAllOptionsToFalse()
      setIsFollows(true)
    }
  }, [whichTab])

  return (
    <>
      <CNav as="nav" variant="tabs" layout="fill" className="flex-column flex-sm-row">
        <CNavLink active={isAbout} onClick={setActiveTabAbout}>
          About
        </CNavLink>
        <CNavLink active={isFollows} onClick={setActiveTabFollows}>
          Follows
        </CNavLink>
        <CNavLink active={isNotes} onClick={setActiveTabNotes}>
          Notes
        </CNavLink>
        <CNavLink active={isWikis} onClick={setActiveTabWikis}>
          Wikis
        </CNavLink>
        <CNavLink
          active={isLeaveRating}
          onClick={setActiveTabLeaveRating}
          disabled={developmentMode == 'hide'}
        >
          Leave Rating
        </CNavLink>
        <CNavLink
          active={isRatingsOf}
          onClick={setActiveTabRatingsOf}
          disabled={developmentMode == 'hide'}
        >
          Ratings of
        </CNavLink>
        <CNavLink
          active={isRatingsBy}
          onClick={setActiveTabRatingsBy}
          disabled={developmentMode == 'hide'}
        >
          Ratings by
        </CNavLink>
        <CNavLink
          active={isWotScores}
          onClick={setActiveTabWotScores}
          disabled={developmentMode == 'hide'}
        >
          WoT Scores
        </CNavLink>
      </CNav>
    </>
  )
}

export default TabsNavigation
