import React from 'react'
import PublishNoteNostrReact from './PublishNoteNostrReact'
import PublishNoteNdk from './PublishNoteNdk'

const TestPage4 = () => {
  return (
    <>
      <center>
        <h3>Test Page 4</h3>
        <h4>goal: publish a note using ndk or ndk-react rather than nostr-react.</h4>
      </center>
      <br/>
      <PublishNoteNdk />
      <hr />
      <PublishNoteNostrReact />
    </>
  )
}

export default TestPage4
