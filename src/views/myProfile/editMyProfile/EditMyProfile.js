import * as React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { ndk } from '../../../helpers/ndk'
import { NDKEvent, NDKKind, NDKNip07Signer } from '@nostr-dev-kit/ndk'

import { CCol, CContainer, CRow } from '@coreui/react'
import { getProfileBrainstormFromNpub } from '../../../helpers/brainstorm'

const EditMyProfile = () => {
  // const oMyProfile = useSelector((state) => state.profile)
  const npub = useSelector((state) => state.siteNavigation.npub)
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)
  const oProfileBrainstorm = getProfileBrainstormFromNpub(npub, oProfilesByNpub)

  const [name, setName] = useState(oProfileBrainstorm?.name)
  const [displayName, setDisplayName] = useState(oProfileBrainstorm?.display_name)
  const [website, setWebsite] = useState(oProfileBrainstorm?.website)
  const [about, setAbout] = useState(oProfileBrainstorm?.about)
  const [banner, setBanner] = useState(oProfileBrainstorm?.banner)
  const [picture, setPicture] = useState(oProfileBrainstorm?.picture)
  const [lud06, setLud06] = useState(oProfileBrainstorm?.lud06)
  const [nip05, setNip05] = useState(oProfileBrainstorm?.nip05)

  // NDK supports multiple signers, this one relies on a nip07 browser extension
  // https://github.com/nostr-protocol/nips/blob/master/07.md
  const signer = new NDKNip07Signer()

  // For this example we will only update username, about, and picture
  // Kind0 metadata events can contain other fields
  const update = async () => {
    // kind0s are profile metadata events
    // https://github.com/nostr-protocol/nips/blob/master/01.md
    const kind0 = new NDKEvent(ndk, { kind: NDKKind.Metadata })

    // kind0 content is set to a stringified JSON object {name: <username>, about: <string>, picture: <url, string>, ...}
    // https://github.com/nostr-protocol/nips/blob/master/01.md#kinds
    kind0.content = JSON.stringify({
      name,
      display_name: displayName,
      about,
      picture,
      lud06,
    })

    // TIP: we did not set all the required fields for this to be a valid event

    // event format defined here: https://github.com/nostr-protocol/nips/blob/master/01.md#events-and-signatures
    // NDK will automatically fill in the missing fields that it can

    // CHALLENGE: What are the missing fields? How does NDK fill them in?

    console.log('Unsigned KIND0', kind0.rawEvent())

    // use NIP07 to sign the event
    await kind0.sign(signer)

    console.log('Signed KIND0', kind0.rawEvent())

    // publish the event to the relays we connected to in index.js
    await kind0.publish()
  }

  return (
    <CContainer className="px-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <CRow>
        <center>
          <h3>Edit My Profile</h3>
        </center>
        <div>
          <h2>Update Profile</h2>
          <p>Create a new/updated kind0</p>
          <input
            type="text"
            style={{ width: '90%' }}
            value={displayName}
            placeholder="display_name"
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <br />
          <input
            type="text"
            style={{ width: '90%' }}
            value={name}
            placeholder="name"
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <textarea
            type="text"
            style={{ width: '90%' }}
            value={about}
            placeholder="about"
            onChange={(e) => setAbout(e.target.value)}
          />
          <br />
          <input
            type="text"
            style={{ width: '90%' }}
            value={picture}
            placeholder="picture"
            onChange={(e) => setPicture(e.target.value)}
          />
          <br />
          <input
            type="text"
            style={{ width: '90%' }}
            value={banner}
            placeholder="banner"
            onChange={(e) => setBanner(e.target.value)}
          />
          <br />
          <input
            type="text"
            style={{ width: '90%' }}
            value={website}
            placeholder="website"
            onChange={(e) => setWebsite(e.target.value)}
          />
          <br />
          <input
            type="text"
            style={{ width: '90%' }}
            value={lud06}
            placeholder="lud06"
            onChange={(e) => setLud06(e.target.value)}
          />
          <br />
          <input
            type="text"
            style={{ width: '90%' }}
            value={nip05}
            placeholder="nip05"
            onChange={(e) => setNip05(e.target.value)}
          />
          <br />
          <button onClick={update}>Update</button>
          <br />
          <pre>{JSON.stringify(oProfileBrainstorm, null, 4)}</pre>
        </div>
      </CRow>
    </CContainer>
  )
}

export default EditMyProfile
