import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { NDKEvent, NDKKind, NDKNip07Signer } from '@nostr-dev-kit/ndk'
import { ndk, ndk_brainstorm } from '../../../helpers/ndk'
import { CButton } from '@coreui/react'
import { nip19 } from 'nostr-tools'

const byteSize = (str) => new Blob([str]).size

const oEventDefault = {
  content: '',
  kind: 30000,
  tags: [
    ['P', 'tapestry'],
    ['wordType', 'influenceScoresList'],
    ['w', 'influenceScoresList'],
    ['c', ''],
  ],
  created_at: null,
}

const ExportInfluenceScores = () => {
  const signedIn = useSelector((state) => state.profile.signedIn)
  const signInMethod = useSelector((state) => state.profile.signInMethod)
  const myFollows = useSelector((state) => state.profile.kind3.follows)

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
  const [numTags, setNumTags] = useState(0)

  const createInfluenceScoreEventKind30000 = async (whetherToPublish, whichList) => {
    let numToPublish = 1000
    let includeCurrentFollows = true
    let aDTag = ['d', 'influenceScoresList']
    let aTitleTag = ['title', 'Grapevine WoT Scores List']
    let aDescriptionTag = [
      'description',
      'a list of nostr users and their associated Grapevine WoT Scores as calculated by the Tapestry Protocol',
    ]
    if (whichList == 'top100MinusFollows' || whichList == 'top100IncludingFollows') {
      numToPublish = 100
    }
    if (whichList == 'top100MinusFollows' || whichList == 'top1000MinusFollows') {
      includeCurrentFollows = false
    }
    if (whichList == 'top100MinusFollows') {
      aDTag = ['d', 'influenceScoresList_top100MinusFollows']
      aTitleTag = ['title', 'Top 100 Recommended Follows, according to your Grapevine']
      aDescriptionTag = [
        'description',
        'a list of the top 100 nostr users (not including those you already follow) and their associated Grapevine WoT Scores as calculated by the Tapestry Protocol',
      ]
      console.log('createInfluenceScoreEventKind30000; top100MinusFollows')
    }
    if (whichList == 'top1000MinusFollows') {
      aDTag = ['d', 'influenceScoresList_top1000MinusFollows']
      aTitleTag = ['title', 'Top 1000 Recommended Follows, according to your Grapevine)']
      aDescriptionTag = [
        'description',
        'a list of the top 1000 nostr users (not including those you already follow) and their associated Grapevine WoT Scores as calculated by the Tapestry Protocol',
      ]
      console.log('createInfluenceScoreEventKind30000; top1000MinusFollows')
    }
    if (whichList == 'top100IncludingFollows') {
      aDTag = ['d', 'influenceScoresList_top100IncludingFollows']
      aTitleTag = ['title', 'Grapevine WoT Scores List (100)']
      aDescriptionTag = [
        'description',
        'a list of the top 100 nostr users (including those you already follow) and their associated Grapevine WoT Scores as calculated by the Tapestry Protocol',
      ]
      console.log('createInfluenceScoreEventKind30000; top100IncludingFollows')
    }
    if (whichList == 'top1000IncludingFollows') {
      aDTag = ['d', 'influenceScoresList_top1000IncludingFollows']
      aTitleTag = ['title', 'Grapevine WoT Scores List (1000)']
      aDescriptionTag = [
        'description',
        'a list of the top 1000 nostr users (including those you already follow) and their associated Grapevine WoT Scores as calculated by the Tapestry Protocol',
      ]
      console.log('createInfluenceScoreEventKind30000; top1000IncludingFollows')
    }
    const oEventDefault_cloned = JSON.parse(JSON.stringify(oEventDefault))
    oEventDefault_cloned.tags.push(aDTag)
    oEventDefault_cloned.tags.push(aTitleTag)
    oEventDefault_cloned.tags.push(aDescriptionTag)
    // const ndkEvent = new NDKEvent(ndk_brainstorm)
    const ndkEvent = new NDKEvent(ndk)
    ndkEvent.kind = 30000
    // const aTags = oEventDefault.tags
    const aTags = []
    Object.keys(oProfilesByPubkey).forEach((pubkey, item) => {
      if (includeCurrentFollows || !myFollows.includes(pubkey)) {
        const npub = nip19.npubEncode(pubkey)
        let influence = '' + oProfilesByNpub[npub].wotScores.baselineInfluence.influence // '' + is to make sure it is stringified
        // let influence = oProfilesByNpub[npub].wotScores.baselineInfluence.influence
        // if (influence) {
        aTags.push(['p', pubkey, '', influence]) // third string is typically a relay url; currently it is empty string
        // }
      }
    })
    /*
    const aPubkeys = Object.keys(oProfilesByPubkey)
    for (let x = 0; x < aPubkeys.length; x++) {
      const pubkey = aPubkeys[x]
      if (includeCurrentFollows || !myFollows.includes(pubkey)) {
        const npub = nip19.npubEncode(pubkey)
        let influence = '' + oProfilesByNpub[npub].wotScores.baselineInfluence.influence // '' + is to make sure it is stringified
        // let influence = oProfilesByNpub[npub].wotScores.baselineInfluence.influence
        // if (influence) {
        aTags.push(['p', pubkey, '', influence]) // third string is typically a relay url; currently it is empty string
        // }
      }
    }
    */
    const aTagsSorted = aTags.sort((a, b) => b[3] - a[3])
    const aTagsSortedTopN = []
    aTagsSorted.forEach((t, item) => {
      if (item < numToPublish) {
        aTagsSortedTopN.push(t)
      }
    })
    setNumProfiles(aTagsSortedTopN.length)

    ndkEvent.tags = oEventDefault_cloned.tags.concat(aTagsSortedTopN)
    setNumTags(ndkEvent.tags.length)
    await ndkEvent.sign(signer)
    if (whetherToPublish) {
      console.log('List published! event id: ' + ndkEvent.id)
      await ndkEvent.publish()
      alert('List published! event id: ' + ndkEvent.id)
    }
    if (!whetherToPublish) {
      setONdkEvent(ndkEvent)
    }
  }

  useEffect(() => {
    // createInfluenceScoreEventKind30000(false, 'top1000IncludingFollows')
  }, [])

  return (
    <>
      <p>
        Publish the top 100 pubkeys ranked by Influence Score,{' '}
        <i>not including pubkeys you already follow</i>.
      </p>
      <p>List title: Top 100 Recommended Follows, according to your Grapevine</p>

      <div>
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
            <CButton
              color="primary"
              onClick={() => createInfluenceScoreEventKind30000(true, 'top100MinusFollows')}
            >
              Publish
            </CButton>
          </div>
        </div>
      </div>

      <br />
      <br />
      <hr />

      <p>
        Publish the top 1000 pubkeys ranked by Influence Score,{' '}
        <i>not including pubkeys you already follow</i>.
      </p>
      <p>List title: Top 1000 Recommended Follows, according to your Grapevine</p>

      <div>
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
            <CButton
              color="primary"
              onClick={() => createInfluenceScoreEventKind30000(true, 'top1000MinusFollows')}
            >
              Publish
            </CButton>
          </div>
        </div>
      </div>

      <br />
      <br />
      <hr />

      <p>
        Publish the top 100 pubkeys ranked by Influence Score, <i>including</i> pubkeys you already
        follow.
      </p>
      <p>List title: Grapevine WoT Scores List (100)</p>

      <div>
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
            <CButton
              color="primary"
              onClick={() => createInfluenceScoreEventKind30000(true, 'top100IncludingFollows')}
            >
              Publish
            </CButton>
          </div>
        </div>
      </div>

      <br />
      <br />
      <hr />

      <p>
        Publish the top 1000 pubkeys ranked by Influence Score, <i>including</i> pubkeys you already
        follow.
      </p>
      <p>List title: Grapevine WoT Scores List (1000)</p>

      <div>
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
            <CButton
              color="primary"
              onClick={() => createInfluenceScoreEventKind30000(true, 'top1000IncludingFollows')}
            >
              Publish
            </CButton>
          </div>
        </div>
      </div>

      <br />
      <br />
      <hr />

      <p>
        You will be able to see these lists on listr.lol and use them for your feeds at clients that
        support NIP-51 feeds, including coracle.social and Amethyst.
      </p>

      <div style={{ display: 'none' }}>
        <p>
          Currently only the generic (context is empty) Influence Scores are exported. Contextual
          scores are forthcoming. Currently I am using kind 30000 as per NIP-51. Alternate: kind
          39902, following the tapestry protocol.
        </p>
        <p>
          Only influence scores greater than zero will be included. Currently only the top 1000
          scoring pubkeys.
        </p>
        <div>num pubkeys in local storage: {Object.keys(oProfilesByPubkey).length}</div>
        <div>num pubkeys included in event: {numProfiles}</div>
        <div>number of tags: {numTags}</div>
        <div>file size: {byteSize(JSON.stringify(oNdkEvent)) / 1000000} MB</div>
        <p>Publish button is active.</p>
        <pre>{JSON.stringify(oNdkEvent, null, 4)}</pre>
      </div>
    </>
  )
}

export default ExportInfluenceScores
