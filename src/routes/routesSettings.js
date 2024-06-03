import React from 'react'

// Dashboard
const Settings = React.lazy(() => import('src/views/settings/settings/Settings'))

const Database = React.lazy(() => import('src/views/settings/database/Database.js'))
const Developer = React.lazy(() => import('src/views/settings/developer/Settings.js'))
const Grapevine = React.lazy(() => import('src/views/settings/grapevine/Settings.js'))
const ConceptGraph = React.lazy(() => import('src/views/settings/conceptGraph/Settings.js'))
const NestedLists = React.lazy(() => import('src/views/settings/nestedLists/Settings.js'))
const CuratedLists = React.lazy(() => import('src/views/settings/curatedLists/Settings.js'))
const NIP51Lists = React.lazy(() => import('src/views/settings/nip51Lists/Settings.js'))
const Relays = React.lazy(() => import('src/views/settings/relays/Settings.js'))
const Twittr = React.lazy(() => import('src/views/settings/twittr/Settings.js'))
const Nostrapedia = React.lazy(() => import('src/views/settings/wiki/Settings.js'))
const NostrAppsDirectory = React.lazy(
  () => import('src/views/settings/nostrAppsDirectory/Settings.js'),
)
const RelaysDirectory = React.lazy(() => import('src/views/settings/relaysDirectory/Settings.js'))

const routes = [
  { path: '/settings', name: 'Settings', element: Settings },

  { path: '/settings/database', name: 'Database', element: Database },
  { path: '/settings/developer', name: 'Developer', element: Developer },
  { path: '/settings/grapevine', name: 'Grapevine', element: Grapevine },
  { path: '/settings/conceptGraph', name: 'Concept Graph', element: ConceptGraph },
  { path: '/settings/nestedLists', name: 'Nested Lists', element: NestedLists },
  { path: '/settings/curatedLists', name: 'Curated Lists', element: CuratedLists },
  { path: '/settings/nip51Lists', name: 'NIP-51 Lists', element: NIP51Lists },
  { path: '/settings/relays', name: 'Relays', element: Relays },
  { path: '/settings/twittr', name: 'Twittr', element: Twittr },
  { path: '/settings/wiki', name: 'Nostrapedia', element: Nostrapedia },
  {
    path: '/settings/nostrAppsDirectory',
    name: 'Nostr Apps Directory',
    element: NostrAppsDirectory,
  },
  { path: '/settings/relaysDirectory', name: 'Relays Directory', element: RelaysDirectory },
]

export default routes
