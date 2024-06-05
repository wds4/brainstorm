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
        <center>
          <div>This may take a while. (Hopefully no more than 30-60 seconds).</div>
        </center>
      </>
    )
  }
  return <InfluenceCalculations />
}

const CalculatingIndicator = ({ calculatingIndicator }) => {
  if (calculatingIndicator == 'yes') {
    return (
      <>
        <center>
          <div>Calculations initiated...</div>
        </center>
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

const RecalculationIndicator = ({ numProfiles, profilesAdded }) => {
  if (!numProfiles) {
    return (
      <>
        <div style={{ color: 'orange', margin: '20px' }}>
          INFLUENCE SCORES HAVE NOT YET BEEN CALCULATED.
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
  const aProfilesWithKnownFollows = []
  Object.keys(oProfilesByNpub).forEach((np) => {
    if (oProfilesByNpub[np].follows && oProfilesByNpub[np].follows.length > 0) {
      aProfilesWithKnownFollows.push(np)
    }
  })

  let numFollowsText = aProfilesWithKnownFollows.length + ' profiles'
  if (aProfilesWithKnownFollows.length == 1) {
    numFollowsText = aProfilesWithKnownFollows.length + ' profile'
  }
  let promptClassName = 'hide'
  if (aProfilesWithKnownFollows.length < 10) {
    promptClassName = 'show'
  }
  const [promptNeedMoreFollowsDataClassName, setPromptNeedMoreFollowsDataClassName] =
    useState(promptClassName)

  return (
    <>
      <center>
        <h4>Influence Scores</h4>
        <br />
        <div>
          Influence Score interpretation: 1 = person, 0 = bot, more than 1 = worthy of special
          attention
        </div>
        <br />
        <div className={promptNeedMoreFollowsDataClassName}>
          <div
            style={{
              border: '2px solid purple',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '10px',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            You have follows data on only {numFollowsText}. You should first load more follows data
            under{' '}
            <CButton color="primary" href="#/settings/settings" style={{ marginLeft: '5px' }}>
              settings
            </CButton>
            .
          </div>
        </div>
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
        <br />
        <br />
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
