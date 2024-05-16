import React from 'react'

// Dashboard
const NostrAppsDirectory = React.lazy(() => import('src/views/nostrAppsDirectory/index'))

const routes = [
  { path: '/nostrAppsDirectory', name: 'Nostr Apps Directory', element: NostrAppsDirectory },
]

export default routes
