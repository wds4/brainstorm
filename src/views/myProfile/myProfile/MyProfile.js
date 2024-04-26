import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNDK } from '@nostr-dev-kit/ndk-react'

const MyProfile = () => {
  const myNpub = useSelector((state) => state.profile.npub)
  const myPubkey = useSelector((state) => state.profile.pubkey)
  const myName = useSelector((state) => state.profile.name)
  const myDisplayName = useSelector((state) => state.profile.display_name)
  const myPicture = useSelector((state) => state.profile.picture)

  const myCurrentProfileKind3CreatedAt = useSelector((state) => state.profile.kind3.created_at)
  const myCurrentProfileKind3Relays = useSelector((state) => state.profile.kind3.relays)
  const myCurrentProfileKind3Follows = useSelector((state) => state.profile.kind3.follows)

  const { fetchEvents } = useNDK()

  const [kind1Events, setKind1Events] = useState([])

  const filter = {
    authors: [myPubkey],
    since: 0,
    kinds: [1],
  }
  useEffect(() => {
    async function updateMyFollowsAndRelays() {
      if (myPubkey) {
        const events = await fetchEvents(filter)
        // cycle through events and add them to kind1Events; they seem to come in spurts
        setKind1Events(events)
      }
    }
    updateMyFollowsAndRelays()
  }, [fetchEvents(filter)])

  return (
    <>
      <div>myNpub: {myNpub}</div>
      <div>myPubkey: {myPubkey}</div>
      <div>myName: {myName}</div>
      <div>myDisplayName: {myDisplayName}</div>
      <div>myPicture: {myPicture}</div>
      <div>kind1Events.length: {kind1Events.length}</div>
      <div>myCurrentProfileKind3CreatedAt: {myCurrentProfileKind3CreatedAt}</div>
      <div>
        Object.keys(myCurrentProfileKind3Relays).length:{' '}
        {Object.keys(myCurrentProfileKind3Relays).length}
      </div>
      <div>myCurrentProfileKind3Follows.length: {myCurrentProfileKind3Follows.length}</div>
    </>
  )
}

export default MyProfile
