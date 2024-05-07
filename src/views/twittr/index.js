import React from 'react'
import { useDispatch } from 'react-redux'
import { updateApp } from 'src/redux/features/siteNavigation/slice'

const TwittrDashboard = () => {
  const dispatch = useDispatch()
  dispatch(updateApp('twittr'))
  return (
    <>
      <center>
        <h3>Twittr Dashboard</h3>
        <div>This app is under construction!</div>
      </center>
    </>
  )
}

export default TwittrDashboard
