import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateCoracleWoT } from '../../../redux/features/profiles/slice'

const TestPage5 = () => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const myFollows = useSelector((state) => state.profile.kind3.follows)
  const myNpub = useSelector((state) => state.profile.npub)
  const oProfilesByPubkey = useSelector((state) => state.profiles.oProfiles.byPubkey)

  const dispatch = useDispatch()

  useEffect(() => {
    function calculateWoTScores() {
      Object.keys(oProfilesByNpub).forEach((npub, item) => {
        /*
        let wotScore = 0
        let refFollowers = []
        if (oProfilesByNpub[npub] && oProfilesByNpub[npub].followers) {
          refFollowers = oProfilesByNpub[npub].followers
        }
        refFollowers.forEach((refPubkey, item) => {
          if (myFollows.includes(refPubkey)) {
            wotScore++
          }
        })
        */
        if (item < 5000) {
          let oData = {}
          oData.myNpub = myNpub
          oData.refNpub = npub
          oData.myFollows = myFollows
          dispatch(updateCoracleWoT(oData))
        }
      })
    }
    calculateWoTScores()
  }, [])
  return (
    <>
      <center>
        <h3>Test Page 5</h3>
        <div>Calculate WoT Score and store to redux store</div>
      </center>
    </>
  )
}

export default TestPage5
