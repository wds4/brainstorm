import React from 'react'

// Dashboard
const ContentDiscovery = React.lazy(() => import('src/views/contentDiscovery/index'))

// About
const ContentDiscoveryAbout = React.lazy(() => import('src/views/contentDiscovery/about/About'))

const Recommendations = React.lazy(() => import('src/views/contentDiscovery/recommendations/index'))

const routes = [
  { path: '/contentDiscovery', name: 'Content Discovery', element: ContentDiscovery },

  { path: '/contentDiscovery/about', name: 'About', element: ContentDiscoveryAbout },

  { path: '/contentDiscovery/recommendations', name: 'Recommendations', element: Recommendations },
]

export default routes
