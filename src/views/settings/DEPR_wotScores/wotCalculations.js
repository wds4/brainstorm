import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateAllBaselineInfluenceScores,
  updateBaselineInfluence,
} from 'src/redux/features/profiles/slice'

const WotCalculations = () => {
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

  const [progressIndicator, setProgressIndicator] = useState(' ... calculating ... ')
  useEffect(() => {
    // initialize with my profile data
    const oResult = initializeProfileData(aAllProfilesByPubkey) // aMyFollows, aNearbyProfilesByPubkey, aAllProfilesByPubkey
    // dispatch(updateAllWotScores(oResult))
    setProgressIndicator('Calculations complete.')
  }, [])

  return <div>{progressIndicator}</div>
}

export default WotCalculations
