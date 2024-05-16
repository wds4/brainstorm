import { CButton, CFormInput, CFormSelect } from '@coreui/react'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import FollowerCrawler from './followerCrawler'
import { nip19 } from 'nostr-tools'
import FollowersCrawlerListener from '../../../helpers/listeners/FollowersCrawlerListener'

const TestPage1 = () => {
  const [aNpubsWithoutKind3Event, setANpubsWithoutKind3Event] = React.useState([])
  const [aPubkeysWithoutKind3Event, setANPubkeysWithoutKind3Event] = React.useState([])
  const [crawlerState, setCrawlerState] = React.useState('off')
  const [npub, setNpub] = React.useState('')
  const [dos, setDos] = React.useState(3)
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const aProfilesByNpub = Object.keys(oProfilesByNpub)

  useEffect(() => {
    function updateArray() {
      const aOutputNpubs = []
      const aOutputPubkeys = []
      let isNewAdded = false
      aProfilesByNpub.forEach((npub) => {
        if (!oProfilesByNpub[npub].kind3.oEvent) {
          const decoded = nip19.decode(npub)
          if (decoded.type == 'npub') {
            const pubkey = decoded.data
            if (!aOutputPubkeys.includes(pubkey)) {
              aOutputNpubs.push(npub)
              aOutputPubkeys.push(pubkey)
              if (!aNpubsWithoutKind3Event.includes(npub)) {
                isNewAdded = true
              }
            }
          }
        }
      })
      // ought to update this only if there is a change in it
      if (isNewAdded) {
        setANpubsWithoutKind3Event(aOutputNpubs)
        setANPubkeysWithoutKind3Event(aOutputPubkeys)
      }
    }
    updateArray()
  }, [aProfilesByNpub])

  const handleNpubChange = (e) => {
    setNpub(e.target.value)
  }
  const handleDosChange = (e) => {
    setDos(e.target.value)
  }
  const startCrawling = () => {
    console.log('startCrawling')
    const decoded = nip19.decode(npub)
    if (decoded.type == 'npub') {
      const pubkey = decoded.data
      setANPubkeysWithoutKind3Event([pubkey])
    }
    setCrawlerState('on')
  }
  return (
    <>
      <FollowersCrawlerListener />
      <center>
        <h3>Test Page 1: the Follower Crawler</h3>
      </center>
      <div>
        Purpose: to download all profiles within X degrees of freedom, starting from a seed user
      </div>
      <div>aProfilesByNpub.length: {aProfilesByNpub.length}</div>
      <br />
      <CFormInput
        type="text"
        id="npubInput"
        placeholder="npub ..."
        required
        value={npub}
        onChange={(e) => {
          handleNpubChange(e)
        }}
      />
      <div style={{ display: 'inline-block' }}>
        <CFormSelect
          className="mb-3"
          label="select degrees of separation"
          onChange={(e) => {
            handleDosChange(e)
          }}
          value={dos}
        >
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </CFormSelect>
        <CButton color="primary" onClick={startCrawling}>
          Start Crawling
        </CButton>
      </div>
      <FollowerCrawler
        aPubkeysWithoutKind3Event={aPubkeysWithoutKind3Event}
        crawlerState={crawlerState}
      />
    </>
  )
}

export default TestPage1
