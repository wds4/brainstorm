import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateGrapevineScores } from '../../../../redux/features/settings/slice'
import { updateAllCoracleScores } from '../../../../redux/features/profiles/slice'
import { returnWoTScore } from '../../../../helpers/brainstorm'

const oDefaultData = {
  follows: [],
  followers: [],
  wotScoreData: {
    score: 0,
  },
}

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
    aPubkeysUnderConsideration.forEach((pubkey) => {
      oObj[pubkey] = JSON.parse(JSON.stringify(oDefaultData))
      if (oProfilesByPubkey[pubkey] && oProfilesByNpub[oProfilesByPubkey[pubkey]]) {
        oObj[pubkey].follows = oProfilesByNpub[oProfilesByPubkey[pubkey]].follows
        oObj[pubkey].followers = oProfilesByNpub[oProfilesByPubkey[pubkey]].followers
      }
    })

    return oObj
  }

  const [progressIndicator, setProgressIndicator] = useState(' ... calculating ... ')
  useEffect(() => {
    // init profiles and set all WoT scores to zero
    let oProfiles = initializeProfileData(aAllProfilesByPubkey) // aMyFollows, aNearbyProfilesByPubkey, aAllProfilesByPubkey
    // cycle through everyone with DoS score below 3 and calculate WoT score
    Object.keys(oProfiles).forEach((pk) => {
      // if (oProfilesByNpub[oProfilesByPubkey[pk]].wotScores.degreesOfSeparationFromMe < 999) {
        const npub_subject = oProfilesByPubkey[pk]
        const wotScore = returnWoTScore(myNpub, npub_subject, oProfilesByNpub)
        oProfiles[pk].wotScoreData.score = wotScore
      // }
    })

    // update scores in redux store
    dispatch(updateAllCoracleScores(oProfiles))
    let oFoo = {}
    oFoo.scoreType = 'wotScore'
    oFoo.numProfiles = Object.keys(aAllProfilesByPubkey).length
    dispatch(updateGrapevineScores(oFoo))
    setProgressIndicator('Calculations complete.')
  }, [])

  return <div>{progressIndicator}</div>
}

export default WotCalculations
