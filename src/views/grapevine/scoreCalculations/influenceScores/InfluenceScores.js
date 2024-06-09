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

  const signedIn = useSelector((state) => state.profile.signedIn)
  const oMyProfile = oProfilesByNpub[myNpub]
  let aOneHop = []
  let aTwoHops = []
  let aMoreHops = []
  let aDisconnected = []
  if (oMyProfile) {
    aOneHop = oMyProfile.follows
  }
  const aProfilesWithKnownFollows = []
  Object.keys(oProfilesByNpub).forEach((np) => {
    if (oProfilesByNpub[np].follows && oProfilesByNpub[np].follows.length > 0) {
      aProfilesWithKnownFollows.push(np)
    }
    if (
      oProfilesByNpub[np] &&
      oProfilesByNpub[np].wotScores &&
      oProfilesByNpub[np].wotScores.degreesOfSeparation
    ) {
      const dos = oProfilesByNpub[np].wotScores.degreesOfSeparation
      if (dos == 2) {
        if (!aTwoHops.includes(np)) {
          aTwoHops.push(np)
        }
      }
      if (dos > 2 && dos < 100) {
        if (!aMoreHops.includes(np)) {
          aMoreHops.push(np)
        }
      }
      if (dos > 100) {
        if (!aDisconnected.includes(np)) {
          aDisconnected.push(np)
        }
      }
    }
  })
  let promptClassName = 'hide'
  if (signedIn && aOneHop.length > 0 && aTwoHops == 0) {
    promptClassName = 'show'
  }
  const [promptNeedMoreFollowsDataClassName, setPromptNeedMoreFollowsDataClassName] =
    useState(promptClassName)

  return (
    <>
      <center>
        <h4>Influence Scores</h4>
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
            You need more follows data to extend your Grapevine beyond just one hop. Download it under{' '}
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
        EITHER YOU'RE NOT FOLLOWING ANYBODY, OR YOUR FOLLOWS HAVE NOT YET BEEN DOWNLOADED. EVERYONE'S INFLUENCE SCORES WILL BE ZERO.
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
