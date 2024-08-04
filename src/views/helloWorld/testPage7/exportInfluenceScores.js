import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NDKEvent, NDKKind, NDKNip07Signer } from '@nostr-dev-kit/ndk'
import { ndk_brainstorm } from '../../../helpers/ndk'
import { CButton } from '@coreui/react'
import { nip19 } from 'nostr-tools'

const byteSize = str => new Blob([str]).size;

const oEventDefault = {
  content: '',
  kind: 39902,
  tags: [
    ['P', 'tapestry'],
    ['word', '{}'],
    ['wordType', 'influenceScoresList'],
    ['w', 'influenceScoresList'],
    ['context', ''],
    ['d', 'influenceScoresList'],
  ],
  created_at: null,
}

const ExportInfluenceScores = () => {
  const signedIn = useSelector((state) => state.profile.signedIn)
  const signInMethod = useSelector((state) => state.profile.signInMethod)

  if (!signedIn || signInMethod != 'extension') {
    return (
      <>
        <center>
          <h3>Export Influence Scores</h3>
        </center>
        <div>You must be signed in via the extension method to export Influence Scores.</div>
        <div>signedIn: {signedIn}</div>
        <div>signInMethod: {signInMethod}</div>
      </>
    )
  }

  const signer = new NDKNip07Signer()
  const oProfilesByPubkey = useSelector((state) => state.profiles.oProfiles.byPubkey)
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)

  const [oNdkEvent, setONdkEvent] = useState({})
  const [numProfiles, setNumProfiles] = useState(0)

  const createInfluenceScoreEvent = async (whetherToPublish) => {
    const ndkEvent = new NDKEvent(ndk_brainstorm)
    ndkEvent.kind = 39902 // or kind 51 ?
    // const aTags = oEventDefault.tags
    const aTags = []
    Object.keys(oProfilesByPubkey).forEach((pubkey, item) => {
      const npub = nip19.npubEncode(pubkey)
      let influence = '' + oProfilesByNpub[npub].wotScores.baselineInfluence.influence // '' + is to make sure it is stringified
      if (influence > 0.1) {
        aTags.push(['p', pubkey, influence])
      }
    })
    const aTagsSorted = aTags.sort((a, b) => b[2] - a[2])
    setNumProfiles(aTagsSorted.length)
    ndkEvent.tags = oEventDefault.tags.concat(aTagsSorted)
    await ndkEvent.sign(signer)
    // console.log('ndkEvent: ' + JSON.stringify(ndkEvent, null, 4))
    if (whetherToPublish) {
      console.log('publish: YES')
      await ndkEvent.publish()
    }
    if (!whetherToPublish) {
      console.log('publish: NO')
      setONdkEvent(ndkEvent)
    }
  }
  useEffect(() => {
    createInfluenceScoreEvent(false)
  }, [])

  return (
    <>
      <center>
        <h3>Export Influence Scores</h3>
      </center>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            flexGrow: 'auto',
          }}
        >
          <CButton color="primary" onClick={() => createInfluenceScoreEvent(true)}>
            Publish
          </CButton>
        </div>
      </div>
      <div>num profiles starting: {Object.keys(oProfilesByPubkey).length}</div>
      <div>num profiles with nonzero influence: {numProfiles}</div>
      <div>size: {byteSize(JSON.stringify(oNdkEvent)) / 1000000} MB</div>
      <pre>{JSON.stringify(oNdkEvent, null, 4)}</pre>
    </>
  )
}

export default ExportInfluenceScores
