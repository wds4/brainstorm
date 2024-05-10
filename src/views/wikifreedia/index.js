import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateApp } from 'src/redux/features/siteNavigation/slice'
import WikiListener from '../../helpers/listeners/WikiListener'

const WikifreediaDashboard = () => {
  const dispatch = useDispatch()
  dispatch(updateApp('wikifreedia'))

  const oWikiAtricles = useSelector((state) => state.wikifreedia.articles.byNaddr)
  return (
    <>
      <WikiListener />
      <center>
        <h3>Wiki Dashboard</h3>
      </center>
      <div>number of wiki articles: {Object.keys(oWikiAtricles).length}</div>
    </>
  )
}

export default WikifreediaDashboard
