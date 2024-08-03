import { CButton } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import DosCalculator from './dosCalculator'

const returnCurrentDegreeOfSeparation = (oProfilesByNpub, npub) => {
  let cDoS = 998
  if (oProfilesByNpub[npub] && oProfilesByNpub[npub].wotScores) {
    cDoS = oProfilesByNpub[npub].wotScores.degreesOfSeparation
  }
  return cDoS
}

const returnFollowNpubs = (oProfilesByNpub, npub) => {
  let aFollowNpubs = []
  if (
    oProfilesByNpub[npub] &&
    oProfilesByNpub[npub].kind3 &&
    oProfilesByNpub[npub].kind3.oEvent &&
    oProfilesByNpub[npub].kind3.oEvent.content
  ) {
    const aTags = oProfilesByNpub[npub].kind3.oEvent.tags
    aTags.forEach((aTag, item) => {
      if (aTag[0] == 'p') {
        const pk = aTag[1]
        const np = nip19.npubEncode(pk)
        aFollowNpubs.push(np)
      }
    })
  }
  return aFollowNpubs
}

const TestPage2 = () => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const aProfilesByNpub = Object.keys(oProfilesByNpub)
  const [calculatingState, setCalculatingState] = React.useState('off')
  const [oProfilesByDoS, setOProfilesByDoS] = useState({})

  const initializeArray = () => {
    // create oProfilesByDoS object, based on existing degreesOfSeparation in redux store
    const oFoo = {}
    aProfilesByNpub.forEach((npub) => {
      const cDoS = returnCurrentDegreeOfSeparation(oProfilesByNpub, npub)
      if (!oFoo[cDoS]) {
        oFoo[cDoS] = []
      }
      if (!oFoo[cDoS].includes(npub)) {
        oFoo[cDoS].push(npub)
      }
    })
    setOProfilesByDoS(oFoo)
    return oFoo
  }

  // init array according to degrees of separation
  useEffect(() => {
    initializeArray()
  }, [])

  const startCalculating = () => {
    setCalculatingState('on')
  }
  return (
    <>
      <center>
        <h3>Test Page 2</h3>
        <div>Calculate degree of separation</div>
      </center>
      <div>calculatingState: {calculatingState}</div>
      <CButton color="primary" onClick={startCalculating}>
        Start Calculating
      </CButton>
      <div>aProfilesByNpub.length: {aProfilesByNpub.length}</div>
      <DosCalculator oProfilesByNpub={oProfilesByNpub} oProfilesByDoS={oProfilesByDoS} calculatingState={calculatingState} />
      {Object.keys(oProfilesByDoS).map((dos, item) => {
        return (
          <li key={item}>
            {dos}: {oProfilesByDoS[dos].length}
          </li>
        )
      })}
      <div>oProfilesByDoS:</div>
      <pre style={{ height: '300px', overflow: 'scroll' }}>
        {JSON.stringify(oProfilesByDoS, null, 4)}
      </pre>
    </>
  )
}

export default TestPage2
