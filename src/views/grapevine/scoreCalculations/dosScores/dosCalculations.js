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
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oProfilesByPubkey = useSelector((state) => state.profiles.oProfiles.byPubkey)

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
    return JSON.parse(JSON.stringify(oObj))
  }

  // currentDos = 0, then 1, then 2, etc
  // for each profile in the input array:
  // get list of followers
  // update dos score for each member in the list of followers
  // for each profile that gets updated, add that profile
  const cycleThroughArrayOfProfiles = (currentDegree, oProfilesIn) => {
    let changesMade = false
    let oProfilesOut = JSON.parse(JSON.stringify(oProfilesIn))
    Object.keys(oProfilesIn).forEach((pubkey_parent, item1) => {
      const score_parent = Number(oProfilesIn[pubkey_parent].dosData.score)
      const follows = oProfilesIn[pubkey_parent].follows
      follows.forEach((pubkey_child, item2) => {
        const score_child = Number(oProfilesIn[pubkey_child].dosData.score)
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
    let oStartingData = {}
    oStartingData[0] = 0
    oStartingData[1] = 0
    oStartingData[2] = 0
    oStartingData[3] = 0
    oStartingData[4] = 0
    oStartingData[5] = 0
    Object.keys(oProfiles).forEach((pubkey, item) => {
      const dosScore = oProfiles[pubkey].dosData.score
      oStartingData[dosScore]++
    })
    let changesMade = false
    let currentDegree = 0
    do {
      changesMade = false
      const result = cycleThroughArrayOfProfiles(currentDegree, oProfiles)
      const oProfilesOut = JSON.parse(JSON.stringify(result.oProfilesOut))
      changesMade = result.changesMade
      oProfiles = JSON.parse(JSON.stringify(oProfilesOut))
      currentDegree++
    } while (changesMade == true && currentDegree < 10)
    dispatch(updateAllDegreesOfSeparationScores(oProfiles))
    let oFoo = {}
    oFoo.scoreType = 'degreesOfSeparation'
    oFoo.numProfiles = Object.keys(aAllProfilesByPubkey).length
    dispatch(updateGrapevineScores(oFoo))
    setProgressIndicator('Calculations complete.')

    let oEndingData = {}
    oEndingData[0] = 0
    oEndingData[1] = 0
    oEndingData[2] = 0
    oEndingData[3] = 0
    oEndingData[4] = 0
    oEndingData[5] = 0
    Object.keys(oProfiles).forEach((pubkey, item) => {
      const dosScore = oProfiles[pubkey].dosData.score
      oEndingData[dosScore]++
    })
  }, [])

  return (
    <>
      <center>
        <div>{progressIndicator}</div>
      </center>
    </>
  )
}

export default DosCalculations
