import React from 'react'

// Dashboard
const NestedLists = React.lazy(() => import('src/views/nestedLists/index'))

// Settings
const Settings = React.lazy(() => import('src/views/settings/nestedLists/Settings'))

const routes = [
  { path: '/nestedLists', name: 'Nested Lists', element: NestedLists },
  { path: '/nestedLists/settings', name: 'Settings', element: Settings },
]

export default routes
