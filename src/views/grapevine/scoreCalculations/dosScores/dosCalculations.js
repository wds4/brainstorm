import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateGrapevineScores } from '../../../../redux/features/settings/slice'
import { updateAllDegreesOfSeparationScores } from '../../../../redux/features/profiles/slice'

const oDefaultData = {
  follows: [],
  followers: [],
  dosData: {
    score: 999,
  },
}

const DosCalculations = () => {
  const myNpub = useSelector((state) => state.profile.npub)
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const aMyFollows = useSelector((state) => state.profiles.oProfiles.byNpub[myNpub].follows)
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oProfilesByPubkey = useSelector((state) => state.profiles.oProfiles.byPubkey)
  const oMyProfile = useSelector((state) => state.profiles.oProfiles.byNpub[myNpub])

  const aAllProfilesByPubkey = Object.keys(oProfilesByPubkey)

  const dispatch = useDispatch()

  const initializeProfileData = (aPubkeysUnderConsideration) => {
    let oObj = {}
    aPubkeysUnderConsideration.forEach((pubkey) => {
      oObj[pubkey] = JSON.parse(JSON.stringify(oDefaultData))
      if (oProfilesByPubkey[pubkey] && oProfilesByNpub[oProfilesByPubkey[pubkey]]) {
        oObj[pubkey].follows = oProfilesByNpub[oProfilesByPubkey[pubkey]].follows
        oObj[pubkey].followers = oProfilesByNpub[oProfilesByPubkey[pubkey]].followers
      }
    })
    oObj[myPubkey] = JSON.parse(JSON.stringify(oDefaultData))
    oObj[myPubkey].follows = oProfilesByNpub[oProfilesByPubkey[myPubkey]].follows
    oObj[myPubkey].followers = oProfilesByNpub[oProfilesByPubkey[myPubkey]].followers
    oObj[myPubkey].dosData.score = 0

    return oObj
  }

  // currentDos = 0, then 1, then 2, etc
  // for each profile in the input array:
  // get list of followers
  // update dos score for each member in the list of followers
  // for each profile that gets updated, add that profile
  const cycleThroughArrayOfProfiles = (currentDegree, oProfilesIn) => {
    console.log('cycleThroughArrayOfProfiles; currentDegree: ' + currentDegree)
    let changesMade = false
    let oProfilesOut = JSON.parse(JSON.stringify(oProfilesIn))
    Object.keys(oProfilesIn).forEach((pubkey_parent, item1) => {
      const score_parent = oProfilesIn[pubkey_parent].dosData.score
      const follows = oProfilesIn[pubkey_parent].follows
      follows.forEach((pubkey_child, item2) => {
        const score_child = oProfilesIn[pubkey_child].dosData.score
        if (score_child > score_parent + 1) {
          changesMade = true
          oProfilesOut[pubkey_child].dosData.score = score_parent + 1
        }
      })
    })
    let result = {}
    result.oProfilesOut = JSON.parse(JSON.stringify(oProfilesOut))
    result.changesMade = changesMade
    return result
  }

  const [progressIndicator, setProgressIndicator] = useState(' ... calculating ... ')
  useEffect(() => {
    let oProfiles = initializeProfileData(aAllProfilesByPubkey) // aMyFollows, aNearbyProfilesByPubkey, aAllProfilesByPubkey
    let changesMade = false
    let currentDegree = 0
    do {
      changesMade = false
      console.log('currentDegree A: ' + currentDegree)
      const result = cycleThroughArrayOfProfiles(currentDegree, oProfiles)
      const oProfilesOut = result.oProfilesOut
      changesMade = result.changesMade
      oProfiles = JSON.parse(JSON.stringify(oProfilesOut))
      console.log('currentDegree B: ' + currentDegree)
      currentDegree++
    } while (changesMade == true && currentDegree < 10)
    dispatch(updateAllDegreesOfSeparationScores(oProfiles))
    let oFoo = {}
    oFoo.scoreType = 'degreesOfSeparation'
    oFoo.numProfiles = Object.keys(aAllProfilesByPubkey).length
    dispatch(updateGrapevineScores(oFoo))
    setProgressIndicator('Calculations complete.')
  }, [])

  return <div>{progressIndicator}</div>
}

export default DosCalculations
