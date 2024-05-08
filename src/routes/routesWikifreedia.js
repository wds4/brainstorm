import React from 'react'

// Dashboard
const Wikifreedia = React.lazy(() => import('src/views/wikifreedia/index'))

// Settings
const Settings = React.lazy(() => import('src/views/settings/wikifreediaSettings/Settings'))

const routes = [
  { path: '/wikifreedia', name: 'Wikifreedia', element: Wikifreedia },
  { path: '/wikifreedia/settings', name: 'Settings', element: Settings },
]

export default routes
