import React from 'react'

// Dashboard
const RelaysDirectory = React.lazy(() => import('src/views/relaysDirectory/index'))

const routes = [
  { path: '/relaysDirectory', name: 'Relays Directory', element: RelaysDirectory },
]

export default routes
