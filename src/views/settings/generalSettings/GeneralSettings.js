import React from 'react'

const GeneralSettings = () => {
  const currentTime = Math.floor(Date.now() / 1000)
  return (
    <>
      <h1>General Settings</h1>
      <div>currentTime: {currentTime}</div>
    </>
  )
}

export default GeneralSettings
