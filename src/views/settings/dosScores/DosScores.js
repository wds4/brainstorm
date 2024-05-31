import React, { useState } from 'react'
import { CButton } from '@coreui/react'
import { useSelector } from 'react-redux'
import { timeout } from '../../../helpers'
import DosCalculations from './dosCalculations'

const DoCalculation = ({ calculate }) => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  if (calculate == 'no') {
    return (
      <>
        <div>
          This will calculate the degrees of separation (DoS) on all{' '}
          {Object.keys(oProfilesByNpub).length} profiles stored locally.
        </div>
        <div>This may take a while. (Hopefully no more than 30-60 seconds).</div>
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

const DosScores = () => {
  const [calculatingIndicator, setCalculatingIndicator] = useState('no')
  const [calculate, setCalculate] = useState('no')

  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oScoreUpdates = useSelector((state) => state.settings.grapevine.scoreUpdates)
  // const numProfiles = oScoreUpdates.degreesOfSeparation.numProfiles
  // const profilesAdded = Object.keys(oProfilesByNpub).length - oScoreUpdates.degreesOfSeparation.numProfiles
  // const howLongAgo = secsToTimeAgo(oScoreUpdates.degreesOfSeparation.timestamp)

  const numProfiles = 999
  const profilesAdded = 999
  const howLongAgo = 999

  const processButtonClick = async () => {
    setCalculatingIndicator('yes')
    const foo = await timeout(10)
    setCalculate('yes')
  }
  return (
    <>
      <center>
        <h4>Degrees of Separation (dos) Scores</h4>
        <div>{Object.keys(oProfilesByNpub).length} profiles currently</div>
        <div>
          {numProfiles} profiles when DoS Scores were last
          calculated {howLongAgo}
        </div>
        <div>Since then, {profilesAdded} profiles have been added.</div>
        <div>WORK IN PROGRESS (not yet functional)</div>
      </center>
      <br />
      <CalculateScoresButton calculate={calculate} processButtonClick={processButtonClick} />
      <br />
      <CalculatingIndicator calculatingIndicator={calculatingIndicator} />
      <DoCalculation calculate={calculate} />
    </>
  )
}

export default DosScores
