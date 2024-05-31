import React, { useState } from 'react'
import InfluenceCalculations from './influenceCalculations'
import { CButton } from '@coreui/react'
import { useSelector } from 'react-redux'
import { secsToTime, secsToTimeAgo, timeout } from '../../../helpers'

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

const InfluenceScores = () => {
  const [calculatingIndicator, setCalculatingIndicator] = useState('no')
  const [calculate, setCalculate] = useState('no')

  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oScoreUpdates = useSelector((state) => state.settings.grapevine.scoreUpdates)

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
        <div>{Object.keys(oProfilesByNpub).length} profiles currently</div>
        <div>
          {numProfiles} profiles when Influence Scores were last
          calculated {howLongAgo}
        </div>
        <div>Since then, {profilesAdded} profiles have been added.</div>
      </center>
      <br />
      <InfluenceScoreButton calculate={calculate} processButtonClick={processButtonClick} />
      <br />
      <CalculatingIndicator calculatingIndicator={calculatingIndicator} />
      <DoCalculation calculate={calculate} />
    </>
  )
}

export default InfluenceScores
