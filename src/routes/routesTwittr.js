import React from 'react'

// Dashboard
const Twittr = React.lazy(() => import('src/views/twittr/index'))

// Settings
const Settings = React.lazy(() => import('src/views/settings/twittrSettings/Settings'))

const routes = [
  { path: '/twittr', name: 'Twittr', element: Twittr },
  { path: '/twittr/settings', name: 'Settings', element: Settings },
]

export default routes
