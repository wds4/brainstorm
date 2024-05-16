import React from 'react'

// Dashboard
const CuratedLists = React.lazy(() => import('src/views/curatedLists/index'))

const routes = [
  { path: '/curatedLists', name: 'Curated Lists', element: CuratedLists },
]

export default routes
