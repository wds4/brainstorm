import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateAllBaselineInfluenceScores,
  updateBaselineInfluence,
} from 'src/redux/features/profiles/slice'

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
    return oObj
  }

  // currentDos = 0, then 1, then 2, etc
  // for each profile in the input array:
  // get list of followers
  // update dos score for each member in the list of followers
  // for each profile that gets updated, add that profile
  const cycleThroughArrayOfProfiles = (currentDegree) => {
    console.log('cycleThroughArrayOfProfiles; currentDegree: ' + currentDegree)
  }

  const [progressIndicator, setProgressIndicator] = useState(' ... calculating ... ')
  useEffect(() => {
    // initialize with my profile data
    const oResult = initializeProfileData(aAllProfilesByPubkey) // aMyFollows, aNearbyProfilesByPubkey, aAllProfilesByPubkey
    let changesMade = false
    let currentDegree = 0
    do {
      changesMade = false
      console.log('currentDegree: ' + currentDegree)
      cycleThroughArrayOfProfiles(currentDegree)
      currentDegree++
    } while (changesMade == true && currentDegree < 10)
    // dispatch(updateAllDosScores(oResult))
    setProgressIndicator('Calculations complete.')
  }, [])

  return <div>{progressIndicator}</div>
}

export default DosCalculations
