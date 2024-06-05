import React, { useState } from 'react'
import InfluenceCalculations from './influenceCalculations'
import { CButton } from '@coreui/react'
import { useSelector } from 'react-redux'
import { secsToTimeAgo, timeout } from 'src/helpers'

const DoCalculation = ({ calculate }) => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  if (calculate == 'no') {
    return (
      <>
        <div>
          This will calculate the influence scores on all {Object.keys(oProfilesByNpub).length}{' '}
          profiles stored locally.
        </div>
        <div>This may take a while. (Hopefully no more than 30-60 seconds).</div>
      </>
    )
  }
  return <InfluenceCalculations />
}

const CalculatingIndicator = ({ calculatingIndicator }) => {
  if (calculatingIndicator == 'yes') {
    return (
      <>
        <div>Calculations initiated...</div>
        <br />
      </>
    )
  }
  return <></>
}

const InfluenceScoreButton = ({ calculate, processButtonClick }) => {
  if (calculate == 'no') {
    return (
      <>
        <CButton onClick={() => processButtonClick()} color="primary">
          Calculate Influence Scores
        </CButton>
      </>
    )
  }
  return <></>
}

const RecalculationIndicator = ({numProfiles, profilesAdded}) => {
  if (!numProfiles) {
    return (
      <>
        <div style={{ color: 'orange', margin: '20px' }}>
          SCORES HAVE NOT YET BEEN CALCULATED.
          <br />
          YOU SHOULD CALCULATE THEM.
        </div>
      </>
    )
  }
  if (profilesAdded > 0) {
    return (
      <>
        <div style={{ color: 'orange', margin: '20px' }}>
          {profilesAdded} PROFILES ADDED SINCE LAST TIME SCORES WERE CALCULATED.
          <br />
          YOU SHOULD RECALCULATE THEM.
        </div>
      </>
    )
  }
  return <></>
}

const InfluenceScores = () => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oScoreUpdates = useSelector((state) => state.settings.grapevine.scoreUpdates)

  const [calculatingIndicator, setCalculatingIndicator] = useState('no')
  const [calculate, setCalculate] = useState('no')

  const myNpub = useSelector((state) => state.profile.npub)
  let aMyFollows = []
  if (myNpub && oProfilesByNpub && oProfilesByNpub[myNpub]) {
    aMyFollows = useSelector((state) => oProfilesByNpub[myNpub].follows)
  }

  let noFollowsWarning = 'hide'
  if (!aMyFollows.length) {
    noFollowsWarning = 'show'
  }

  let numProfiles = 0
  let scoreTimestamp = 0
  if (oScoreUpdates && oScoreUpdates.influenceScore) {
    numProfiles = oScoreUpdates.influenceScore.numProfiles
    scoreTimestamp = oScoreUpdates.influenceScore.timestamp
  }
  const profilesAdded = Object.keys(oProfilesByNpub).length - numProfiles
  const howLongAgo = secsToTimeAgo(scoreTimestamp)

  const processButtonClick = async () => {
    setCalculatingIndicator('yes')
    const foo = await timeout(10)
    setCalculate('yes')
  }
  return (
    <>
      <center>
        <h4>Influence Scores</h4>
        <br />
        <div>Influence Score interpretation: 1 = person, 0 = bot, more than 1 = worthy of special attention</div>
        <br />
        <RecalculationIndicator numProfiles={numProfiles} profilesAdded={profilesAdded} />
        <br />
        <InfluenceScoreButton calculate={calculate} processButtonClick={processButtonClick} />
      </center>
      <div
        style={{
          border: '1px solid red',
          padding: '10px',
          borderRadius: '5px',
          marginTop: '10px',
          marginBottom: '10px',
          textAlign: 'center',
        }}
        className={noFollowsWarning}
      >
        YOU'RE NOT FOLLOWING ANYBODY. EVERYONE'S INFLUENCE SCORES WILL BE ZERO.
        <br/><br/>
        FOR INFLUENCE SCORES TO BE USEFUL, YOU MUST FIRST FOLLOW ONE OR MORE PROFILES.
      </div>
      <br />
      <br />
      <CalculatingIndicator calculatingIndicator={calculatingIndicator} />
      <DoCalculation calculate={calculate} />
    </>
  )
}

export default InfluenceScores

/*
<div>{Object.keys(oProfilesByNpub).length} profiles currently</div>
<div>
  {numProfiles} profiles when Influence Scores were last
  calculated {howLongAgo}
</div>
<div>Since then, {profilesAdded} profiles have been added.</div>
*/
