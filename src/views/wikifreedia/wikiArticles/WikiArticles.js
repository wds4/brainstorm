import React, { useState } from 'react'
import { CContainer, CNav, CNavLink } from '@coreui/react'
import { useSelector } from 'react-redux'
import WikiArticlesChronological from './chronological/Chronological'
import WikiArticlesAlphabetical from './alphabetical/Alphabetical'
import WikiArticlesCategorical from './categorical/Categorical'

const Navigation = ({ updateWhichTab }) => {
  const [isAlphabetical, setIsAlphabetical] = useState(true)
  const [isChronological, setIsChronological] = useState(false)
  const [isCategorical, setIsCategorical] = useState(false)

  const setAllOptionsToFalse = () => {
    setIsAlphabetical(false)
    setIsChronological(false)
    setIsCategorical(false)
  }

  const setActiveTabAlphabetical = () => {
    setAllOptionsToFalse()
    setIsAlphabetical(true)
    updateWhichTab('alphabetical')
  }
  const setActiveTabChronological = () => {
    setAllOptionsToFalse()
    setIsChronological(true)
    updateWhichTab('chronological')
  }
  const setActiveTabCategorical = () => {
    setAllOptionsToFalse()
    setIsCategorical(true)
    updateWhichTab('categorical')
  }

  return (
    <CNav as="nav" variant="tabs" layout="fill" className="flex-column flex-sm-row">
      <CNavLink active={isAlphabetical} onClick={setActiveTabAlphabetical}>
        Alphabetical
      </CNavLink>
      <CNavLink active={isChronological} onClick={setActiveTabChronological}>
        Chronological
      </CNavLink>
      <CNavLink active={isCategorical} onClick={setActiveTabCategorical}>
        Categorical
      </CNavLink>
    </CNav>
  )
}

// eslint-disable-next-line react/prop-types
const Content = ({ whichTab }) => {
  if (whichTab == 'alphabetical') {
    return <WikiArticlesAlphabetical />
  }
  if (whichTab == 'chronological') {
    return <WikiArticlesChronological />
  }
  if (whichTab == 'categorical') {
    return <WikiArticlesCategorical />
  }
  return <WikiArticlesChronological />
}

const WikiTopics = () => {
  const oWikiArticles_byNaddr = useSelector((state) => state.wikifreedia.articles.byNaddr)
  const oWikiArticles_byDTag = useSelector((state) => state.wikifreedia.articles.byDTag)

  const [whichTab, setWhichTab] = useState('alphabetical') // alphabetical, chronological, categorical
  return (
    <>
      <CContainer fluid>
        <center>
          <h3>Wiki Topics</h3>
        </center>
        <Navigation updateWhichTab={setWhichTab} />
        <br />
        <Content whichTab={whichTab} />
      </CContainer>
    </>
  )
}

export default WikiTopics
