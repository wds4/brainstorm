import React from 'react'
import { useSelector } from 'react-redux'

const WikiArticlesCategorical = () => {
  const oWikiArticles_byNaddr = useSelector((state) => state.wikifreedia.articles.byNaddr)
  const oWikiArticles_byDTag = useSelector((state) => state.wikifreedia.articles.byDTag)
  return (
    <>
      <center>
        <h3>Wiki Articles: Categorically</h3>
      </center>

      <div>number of wiki articles by dTag: {Object.keys(oWikiArticles_byDTag).length}</div>
      <div>number of wiki articles by eventId: {Object.keys(oWikiArticles_byNaddr).length}</div>
    </>
  )
}

export default WikiArticlesCategorical
