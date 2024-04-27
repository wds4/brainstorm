import React from 'react'

import { useSelector } from 'react-redux'

const Dashboard = () => {
  const activeApp = useSelector((state) => state.siteNavigation.app)
  const theme = useSelector((state) => state.ui.theme)
  return (
    <>
      <center>
        <h3>Pretty Good Apps</h3>
      </center>
    </>
  )
}

export default Dashboard
