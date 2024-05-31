import React, { useState } from 'react'
import { CButton } from '@coreui/react'
import { useSelector } from 'react-redux'
import { timeout } from '../../../helpers'
import WotCalculations from './wotCalculations'

const DoCalculation = ({ calculate }) => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  if (calculate == 'no') {
    return (
      <>
        <div>
          This will calculate the Web of Trust scores on all {Object.keys(oProfilesByNpub).length}{' '}
          profiles stored locally.
        </div>
        <div>This may take a while. (Hopefully no more than 30-60 seconds).</div>
      </>
    )
  }
  return <WotCalculations />
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
          Calculate Web of Trust (WoT) scores
        </CButton>
      </>
    )
  }
  return <></>
}

const WotScores = () => {
  const [calculatingIndicator, setCalculatingIndicator] = useState('no')
  const [calculate, setCalculate] = useState('no')

  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)

  const processButtonClick = async () => {
    setCalculatingIndicator('yes')
    const foo = await timeout(10)
    setCalculate('yes')
  }
  return (
    <>
      <center>
        <h4>Web of Trust (WoT) Scores</h4>
        <div>{Object.keys(oProfilesByNpub).length} profiles currently</div>
        <div> -- profiles when WoT Scores were last calculated</div>
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

export default WotScores
