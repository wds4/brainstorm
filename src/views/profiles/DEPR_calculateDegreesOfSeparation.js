import React, { useCallback, useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateDegreesOfSeparationFromMe } from '../../redux/features/profiles/slice'
import { nip19 } from 'nostr-tools'

const returnCurrentDegreeOfSeparation = (oProfilesByNpub, npub) => {
  let cDoS = 998
  if (oProfilesByNpub[npub] && oProfilesByNpub[npub].wotScores) {
    cDoS = oProfilesByNpub[npub].wotScores.degreesOfSeparationFromMe
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

const CalculateDegreesOfSeparation = () => {
  const [oProfilesByDoS, setOProfilesByDoS] = useState({})
  const myNpub = useSelector((state) => state.profile.npub)
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const aProfilesByNpub = Object.keys(oProfilesByNpub)

  const dispatch = useDispatch()

  const initializeArray = () => {
    // create oProfilesByDoS object, based on existing degreesOfSeparation in redux store
    const oFoo = {}
    aProfilesByNpub.forEach((npub) => {
      const cDoS = returnCurrentDegreeOfSeparation(oProfilesByNpub, npub)
      // console.log('aProfilesByNpub; ' + npub + '; cDoS: ' + cDoS)
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

  const doOneCycle = useCallback((oFoo) => {
    console.log('doOneCycle; A')
    const aLevels = Object.keys(oFoo)
    console.log('aLevels: ' + JSON.stringify(aLevels))

    aLevels.forEach((dos) => {
      const n = Number(dos)
      const cDoS_minimum = n + 1
      // console.log('doOneCycle; cDoS_minimum: ' + cDoS_minimum)

      if (n < 999) {
        console.log('doOneCycle; n: ' + n)
        const aNpubs = oFoo[n]
        aNpubs.forEach((npub) => {
          // console.log('doOneCycle; npub: ' + npub)
          const aFollowNpubs = returnFollowNpubs(oProfilesByNpub, npub)
          // console.log('doOneCycle; aFollowNpubs.length: ' + aFollowNpubs.length)
          aFollowNpubs.forEach((npub_next) => {
            // console.log('doOneCycle; npub_next: ' + npub_next)
            const cDoS_next = Number(returnCurrentDegreeOfSeparation(oProfilesByNpub, npub_next))
            if (cDoS_next > cDoS_minimum) {
              const npub_toUpdate = npub_next
              const degreesOfSeparationFromMe_new = cDoS_minimum
              // dispatch(updateDegreesOfSeparationFromMe({ npub_toUpdate, degreesOfSeparationFromMe_new }))
            }
          })
        })
      }

    })
    console.log('doOneCycle; Z')
    // oProfilesByDoS[i] for i=0, 1, 2, ... until oProfilesByDoS[i] is empty
    // cycle through each follow and set cDoS to i + 1 unless it is already lower than that
  }, [])

  useEffect(() => {
    function updateMyScore() {
      const degreesOfSeparationFromMe_new = 0
      const npub_toUpdate = myNpub
      // dispatch(updateDegreesOfSeparationFromMe({ npub_toUpdate, degreesOfSeparationFromMe_new }))
    }
    // updateMyScore() // set degreesOfSeparation to zero for my npub
    const oFoo = initializeArray() // create local oProfilesByDoS object, based on existing degreesOfSeparation in redux store
    doOneCycle(oFoo)
  }, [])

  return (
    <>
      <div>CalculateDegreesOfSeparation</div>
    </>
  )
}

export default CalculateDegreesOfSeparation
