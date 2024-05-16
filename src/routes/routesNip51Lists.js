import React from 'react'

// Dashboard
const Nip51Lists = React.lazy(() => import('src/views/nip51Lists/index'))

const routes = [
  { path: '/nip51Lists', name: 'NIP-51 Lists', element: Nip51Lists },
]

export default routes
