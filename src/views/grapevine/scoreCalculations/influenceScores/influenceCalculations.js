import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { convertInputToCertainty } from 'src/helpers/grapevine'
import { defRigor } from 'src/const'
import { updateAllBaselineInfluenceScores } from 'src/redux/features/profiles/slice'
import { updateGrapevineScores } from 'src/redux/features/settings/slice'
import { CButton } from '@coreui/react'
import { updateApp } from '../../../../redux/features/siteNavigation/slice'

const oDefaultData = {
  follows: [],
  followers: [],
  mutes: [],
  mutedBy: [],
  influenceData: {
    influence: 0,
    averageScore: 0,
    input: 0,
    certainty: 0,
  },
}

const InfluenceCalculations = ({setCalculatingComplete}) => {
  const myNpub = useSelector((state) => state.profile.npub)
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const aMyFollows = useSelector((state) => state.profiles.oProfiles.byNpub[myNpub].follows)
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oProfilesByPubkey = useSelector((state) => state.profiles.oProfiles.byPubkey)
  const oMyProfile = useSelector((state) => state.profiles.oProfiles.byNpub[myNpub])

  const aAllProfilesByPubkey = Object.keys(oProfilesByPubkey)
  const aNearbyProfilesByPubkey = []
  aAllProfilesByPubkey.forEach((pubkey) => {
    if (oProfilesByNpub[oProfilesByPubkey[pubkey]].wotScores.degreesOfSeparation < 6)
      if (!aNearbyProfilesByPubkey.includes(pubkey)) {
        // if (oProfilesByNpub[oProfilesByPubkey[pubkey]].wotScores.coracle > 0)
        aNearbyProfilesByPubkey.push(pubkey)
      }
  })

  const dunbarNumber = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.dunbarNumber),
  )
  const attenuationFactor_ = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.attenuationFactor) / 100,
  )
  const rigor_ = Number(useSelector((state) => state.grapevine.controlPanels.baseLayer.rigor)) / 100

  const defaultUserScore_ = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.defaultUserScore.score) / 100,
  )
  const defaultUserConfidence_ = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.defaultUserScore.confidence) /
      100,
  )

  const followInterpretationScore_ = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.followInterpretation.score) /
      100,
  )
  const followInterpretationConfidence_ = Number(
    useSelector(
      (state) => state.grapevine.controlPanels.baseLayer.followInterpretation.confidence,
    ) / 100,
  )

  const muteInterpretationScore_ = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.muteInterpretation.score) / 100,
  )
  const muteInterpretationConfidence_ = Number(
    useSelector((state) => state.grapevine.controlPanels.baseLayer.muteInterpretation.confidence) /
      100,
  )

  const dispatch = useDispatch()

  // oProfileData: the primary data object
  const [oProfileData, setOProfileData] = useState({})

  const calculateInfluenceOneCycle = (oProfData) => {
    let oObj = JSON.parse(JSON.stringify(oProfData))
    Object.keys(oObj).forEach((pk_ratee) => {
      if (pk_ratee != myPubkey) {
        // aAllProfilesByPubkey.forEach((pk_ratee) => {
        // initialize variables
        let sumOfWeights = 0
        let sumOfProducts = 0
        let sumOfWeights_directRatings = 0

        // STEP 1: ADD DIRECT RATINGS

        // cycle through each of this profile's followers
        const aFollowers = JSON.parse(JSON.stringify(oProfData[pk_ratee].followers))
        aFollowers.forEach((pk_rater, item) => {
          if (oProfData[pk_rater]) {
            if (pk_rater && pk_ratee && pk_rater != pk_ratee) {
              // cannot rate oneself
              const rater_influence_ = oProfData[pk_rater].influenceData.influence
              const rating_ = followInterpretationScore_
              let weight = attenuationFactor_ * rater_influence_ * followInterpretationConfidence_
              if (pk_rater == myPubkey) {
                // no attenuationFactor
                weight = rater_influence_ * followInterpretationConfidence_
              }
              const product = weight * rating_
              sumOfWeights += weight
              sumOfProducts += product
            }
          }
        })

        // cycle through each mutedBy
        // const aMutedBy = oProfData[pk_ratee].mutedBy
        const aMutedBy = oProfilesByNpub[oProfilesByPubkey[pk_ratee]].mutedBy
        aMutedBy.forEach((pk_rater) => {
          if (oProfData[pk_rater]) {
            if (pk_rater && pk_ratee && pk_rater != pk_ratee) {
              // cannot rate oneself
              const rater_influence_ = oProfData[pk_rater].influenceData.influence
              const rating_ = muteInterpretationScore_
              let weight = attenuationFactor_ * rater_influence_ * muteInterpretationConfidence_
              if (pk_rater == myPubkey) {
                // no attenuationFactor
                weight = rater_influence_ * muteInterpretationConfidence_
              }
              const product = weight * rating_
              sumOfWeights += weight
              sumOfProducts += product
            }
          }
        })

        // STEP 2: ADD INHERITED SCORE
        // * not yet implemented *

        // STEP 3: ADD DEFAULT SCORE
        // * not yet implemented *

        if (sumOfWeights > 0) {
          const average = (sumOfProducts / sumOfWeights).toPrecision(4)
          const input = sumOfWeights.toPrecision(4)
          const certainty = convertInputToCertainty(input, rigor_)
          const influence = (average * certainty).toPrecision(4)
          oObj[pk_ratee].influenceData.influence = influence
          oObj[pk_ratee].influenceData.averageScore = average
          oObj[pk_ratee].influenceData.certainty = certainty
          oObj[pk_ratee].influenceData.input = input
          let oBaselineInfluence = {}
          oBaselineInfluence.npub = oProfilesByPubkey[pk_ratee]
          oBaselineInfluence.influence = influence
          oBaselineInfluence.averageScore = average
          oBaselineInfluence.certainty = certainty
          oBaselineInfluence.input = input
          // dispatch(updateBaselineInfluence(oBaselineInfluence))
          setOProfileData(oObj)
        }
      }
    })
    return oObj
  }

  const initializeProfileData = (aPubkeysUnderConsideration) => {
    let oObj = {}
    // add my follows

    aPubkeysUnderConsideration.forEach((pubkey) => {
      // aAllProfilesByPubkey.forEach((pubkey) => {
      oObj[pubkey] = JSON.parse(JSON.stringify(oDefaultData))
      const averageScore_ = defaultUserScore_
      const certainty_ = convertInputToCertainty(defaultUserConfidence_, rigor_)
      const influence_ = certainty_ * averageScore_
      oObj[pubkey].influenceData.averageScore = averageScore_
      oObj[pubkey].influenceData.input = defaultUserConfidence_
      oObj[pubkey].influenceData.certainty = certainty_
      oObj[pubkey].influenceData.influence = influence_
      oObj[pubkey].follows = oProfilesByNpub[oProfilesByPubkey[pubkey]].follows
      oObj[pubkey].followers = oProfilesByNpub[oProfilesByPubkey[pubkey]].followers
      oObj[pubkey].mutes = oProfilesByNpub[oProfilesByPubkey[pubkey]].mutes
      oObj[pubkey].mutedBy = oProfilesByNpub[oProfilesByPubkey[pubkey]].mutedBy
      // record in redux store
      let oBaselineInfluence = {}
      oBaselineInfluence.npub = oProfilesByPubkey[pubkey]
      oBaselineInfluence.influence = influence_
      oBaselineInfluence.averageScore = averageScore_
      oBaselineInfluence.certainty = certainty_
      oBaselineInfluence.input = defaultUserConfidence_
      //dispatch(updateBaselineInfluence(oBaselineInfluence))
    })
    // initialize my entry and overwrite if already initialized above
    oObj[myPubkey] = oDefaultData
    oObj[myPubkey].influenceData.influence = 1.0
    oObj[myPubkey].influenceData.averageScore = 1.0
    oObj[myPubkey].influenceData.input = 9999
    oObj[myPubkey].influenceData.certainty = 1.0
    oObj[myPubkey].follows = oMyProfile.follows
    oObj[myPubkey].followers = oMyProfile.followers

    let oBaselineInfluence = {}
    oBaselineInfluence.npub = myNpub
    oBaselineInfluence.influence = 1
    oBaselineInfluence.averageScore = 1
    oBaselineInfluence.certainty = 1
    oBaselineInfluence.input = 99999
    // dispatch(updateBaselineInfluence(oBaselineInfluence))
    setOProfileData(oObj)
    return oObj
  }
  const [progressIndicator, setProgressIndicator] = useState('calculating')
  useEffect(() => {
    // initialize with my profile data
    const oResult = initializeProfileData(aAllProfilesByPubkey) // aMyFollows, aNearbyProfilesByPubkey, aAllProfilesByPubkey
    setOProfileData(oResult)
    const oResult1 = calculateInfluenceOneCycle(oResult)
    const oResult2 = calculateInfluenceOneCycle(oResult1)
    const oResult3 = calculateInfluenceOneCycle(oResult2)
    const oResult4 = calculateInfluenceOneCycle(oResult3)
    const oResult5 = calculateInfluenceOneCycle(oResult4)
    const oResult6 = calculateInfluenceOneCycle(oResult5)
    const oResult7 = calculateInfluenceOneCycle(oResult6)
    const oResult8 = calculateInfluenceOneCycle(oResult7)
    dispatch(updateAllBaselineInfluenceScores(oResult8))
    let oFoo = {}
    oFoo.scoreType = 'influenceScore'
    oFoo.numProfiles = Object.keys(oProfilesByNpub).length
    dispatch(updateGrapevineScores(oFoo))
    setProgressIndicator('complete')
    setCalculatingComplete(true)
  }, [])

  if (progressIndicator == 'calculating') {
    return (
      <center>
        <div>... calculating ...</div>
      </center>
    )
  }
  if (progressIndicator == 'complete') {
    return (
      <>
        <center>
          <div style={{ fontSize: '24px' }}>Calculations complete!</div>
          <br />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Use Influence Scores to sort content on{' '}
            <CButton
              onClick={() => dispatch(updateApp('wiki'))}
              color="primary"
              href="#/nostrapedia"
              style={{ marginLeft: '5px' }}
            >
              Nostrapedia
            </CButton>
            !
          </div>
        </center>
      </>
    )
  }
  return <></>
}

export default InfluenceCalculations
