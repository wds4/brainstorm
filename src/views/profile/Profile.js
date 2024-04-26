import { useNDK } from '@nostr-dev-kit/ndk-react'
import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
  const { getProfile } = useNDK()
  const npub = useSelector((state) => state.siteNavigation.npub)
  const oProfile = getProfile(npub)
  return (
    <>
      <h1>Profile</h1>
      <div>npub: {npub}</div>
      <div>displayName: {oProfile?.displayName}</div>
      <div>name: {oProfile?.name}</div>
      <div>about: {oProfile?.about}</div>
      <div>banner: {oProfile?.banner}</div>
      <div>image: {oProfile?.image}</div>
      <div>nip05: {oProfile?.nip05}</div>
    </>
  )
}

export default Profile
