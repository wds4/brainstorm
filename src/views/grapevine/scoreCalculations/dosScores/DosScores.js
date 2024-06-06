import React, { useState } from 'react'
import { CButton } from '@coreui/react'
import { useSelector } from 'react-redux'
import { secsToTimeAgo, timeout } from 'src/helpers'
import DosCalculations from './dosCalculations'

const DoCalculation = ({ calculate }) => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  if (calculate == 'no') {
    return (
      <>
        <center><div>This may take a while. (Hopefully no more than 30-60 seconds).</div></center>
      </>
    )
  }
  return <DosCalculations />
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

const CalculateScoresButton = ({ calculate, processButtonClick }) => {
  if (calculate == 'no') {
    return (
      <>
        <CButton onClick={() => processButtonClick()} color="primary">
          Calculate Degrees of Separation (DoS)
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
          DoS SCORES HAVE NOT YET BEEN CALCULATED.
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

const DosScores = () => {
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
  if (oScoreUpdates && oScoreUpdates.degreesOfSeparation) {
    numProfiles = oScoreUpdates.degreesOfSeparation.numProfiles
    scoreTimestamp = oScoreUpdates.degreesOfSeparation.timestamp
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
        <h4>Degrees of Separation (DoS) Scores</h4>
        <br />
        <RecalculationIndicator numProfiles={numProfiles} profilesAdded={profilesAdded} />
        <br />
        <CalculateScoresButton calculate={calculate} processButtonClick={processButtonClick} />
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
        YOU'RE NOT FOLLOWING ANYBODY. EVERYONE'S DoS SCORE WILL BE ZERO.
        <br />
        <br />
        FOR DoS SCORES TO BE USEFUL, YOU MUST FIRST FOLLOW ONE OR MORE PROFILES.
      </div>
      <br />
      <br />
      <CalculatingIndicator calculatingIndicator={calculatingIndicator} />
      <DoCalculation calculate={calculate} />
    </>
  )
}

export default DosScores

/*
<div>{Object.keys(oProfilesByNpub).length} profiles currently</div>
<div>
  {numProfiles} profiles when DoS Scores were last
  calculated {howLongAgo}
</div>
<div>Since then, {profilesAdded} profiles have been added.</div>
*/
