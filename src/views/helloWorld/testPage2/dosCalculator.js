import { nip19 } from 'nostr-tools'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateDegreesOfSeparation } from '../../../redux/features/profiles/slice'

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

const processSingleBatchOfProfiles = (oProfilesByNpubRef, aProfiles, dos) => {
  const newMinimumDos = Number(dos) + 1
  aProfiles.forEach((np) => {
    const aFollows = returnFollowNpubs(oProfilesByNpubRef.current, np)
    aFollows.forEach((npf) => {
      const currentDoS = returnCurrentDegreeOfSeparation(oProfilesByNpubRef.current, npf)
      if (currentDoS > newMinimumDos) {
        console.log('currentDoS is greater than newMinimumDos')
      } else {
        console.log('currentDoS is NOT greater than newMinimumDos')
      }
    })
  })
}

const DosCalculator = ({ oProfilesByNpub, oProfilesByDoS, calculatingState }) => {
  const oProfilesByNpubRef = useRef(oProfilesByNpub)
  const aProfilesByDoS = Object.keys(oProfilesByDoS)

  const dispatch = useDispatch()

  useEffect(() => {
    function calculateDegreesOfSeparation() {
      if (calculatingState == 'on') {
        aProfilesByDoS.forEach((dos) => {
          const aProfiles = oProfilesByDoS[dos]
          if (Number(dos) < 10) {
            // processSingleBatchOfProfiles(oProfilesByNpubRef, aProfiles, dos)
            ///// start
            const newMinimumDos = Number(dos) + 1
            aProfiles.forEach((np) => {
              const aFollows = returnFollowNpubs(oProfilesByNpubRef.current, np)
              aFollows.forEach((npf) => {
                const currentDoS = returnCurrentDegreeOfSeparation(oProfilesByNpubRef.current, npf)
                if (currentDoS > newMinimumDos) {
                  // console.log('currentDoS is greater than newMinimumDos')
                  const degreesOfSeparation_new = newMinimumDos
                  const npub_toUpdate = npf
                  dispatch(updateDegreesOfSeparation({npub_toUpdate, degreesOfSeparation_new}))
                } else {
                  // console.log('currentDoS is NOT greater than newMinimumDos')
                }
              })
            })
            ///// end
          }
        })
      }
    }
    calculateDegreesOfSeparation()
  }, [calculatingState])
  return (
    <>
      <div style={{ border: '1px solid orange', borderRadius: '5px', padding: '5px' }}>
        <center>DosCalculator; calculatingState: {calculatingState}</center>
      </div>
    </>
  )
}

export default DosCalculator
