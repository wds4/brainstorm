import React from 'react'
import { useSelector } from 'react-redux'
import MyProfileV3Listener from './myProfileV3Listener'

const V3Listener = () => {
  const listenerMethod = useSelector((state) => state.settings.general.listenerMethod)
  if (listenerMethod == 'v3Listeners') {
    return (
      <>
        <MyProfileV3Listener />
        <div style={{ display: 'inline-block', border: '1px solid grey', padding: '2px' }}>
          V3 Listener: On
        </div>
      </>
    )
  }
  return (
    <>
      <div style={{ display: 'inline-block', border: '1px solid grey', padding: '2px' }}>
        V3 Listener: Off
      </div>
    </>
  )
}

export default V3Listener
