import React, { useState } from 'react'
import { CNav, CNavLink } from '@coreui/react'

// eslint-disable-next-line react/prop-types
const TabsNavigation = ({ whichTab, updateWhichTab }) => {
  const isTab = (queryTab) => {
    if (whichTab == queryTab) {
      return true
    }
    return false
  }
  const [isAbout, setIsAbout] = useState(isTab('about'))
  const [isNotes, setIsNotes] = useState(isTab('notes'))
  const [isWikis, setIsWikis] = useState(isTab('wikis'))
  const [isLeaveRating, setIsLeaveRating] = useState(isTab('leaveRating'))
  const [isRatingsOf, setIsRatingsOf] = useState(isTab('ratingsOf'))
  const [isRatingsBy, setIsRatingsBy] = useState(isTab('ratingsBy'))
  const [isWotScores, setIsWotScores] = useState(isTab('wotScores'))

  const setAllOptionsToFalse = () => {
    setIsAbout(false)
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

  return (
    <CNav as="nav" variant="tabs" layout="fill" className="flex-column flex-sm-row">
      <CNavLink active={isAbout} onClick={setActiveTabAbout}>
        About
      </CNavLink>
      <CNavLink active={isNotes} onClick={setActiveTabNotes}>
        Notes
      </CNavLink>
      <CNavLink active={isWikis} onClick={setActiveTabWikis}>
        Wikis
      </CNavLink>
      <CNavLink active={isLeaveRating} onClick={setActiveTabLeaveRating}>
        Leave Rating
      </CNavLink>
      <CNavLink active={isRatingsOf} onClick={setActiveTabRatingsOf} disabled={true}>
        Ratings of
      </CNavLink>
      <CNavLink active={isRatingsBy} onClick={setActiveTabRatingsBy} disabled={true}>
        Ratings by
      </CNavLink>
      <CNavLink active={isWotScores} onClick={setActiveTabWotScores} disabled={true}>
        WoT Scores
      </CNavLink>
    </CNav>
  )
}

export default TabsNavigation
