import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import ContextSelector from './contextSelector'
import RecommendedProfiles from './tableOfProfiles'

const Recommendations = () => {
  const [context, setContext] = useState('')
  const [oRatedPubkeys, setORatedPubkeys] = useState({})
  const [
    contextualEndorsementsSelectedContextByCid,
    setContextualEndorsementsSelectedContextByCid,
  ] = useState([])

  return (
    <>
      <center>
        <h3>Contextual Recommendation Lists</h3>
      </center>
      <br />
      <div>
        Select a context and see a list of recommended profiles. (Make sure to calculate Influence
        Scores in the Grapevine app if you haven't already done so.)
      </div>
      <br />
      <ContextSelector
        setContext={setContext}
        setContextualEndorsementsSelectedContextByCid={
          setContextualEndorsementsSelectedContextByCid
        }
        setORatedPubkeys={setORatedPubkeys}
      />
      <br />
      <RecommendedProfiles context={context} oRatedPubkeys={oRatedPubkeys} />
    </>
  )
}

export default Recommendations
