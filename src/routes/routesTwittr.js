import React from 'react'

// Dashboard
const Twittr = React.lazy(() => import('src/views/twittr/index'))

// Settings
const Settings = React.lazy(() => import('src/views/settings/twittrSettings/Settings'))

// Content
const TwittrMainFeed = React.lazy(() => import('src/views/twittr/mainFeed/MainFeed'))
const TwittrPostNote = React.lazy(() => import('src/views/twittr/publishNote/PublishNote'))

const routes = [
  { path: '/twittr', name: 'Twittr', element: Twittr },
  { path: '/twittr/settings', name: 'Settings', element: Settings },
  { path: '/twittr/mainFeed', name: 'Twittr Main Feed', element: TwittrMainFeed },
  { path: '/twittr/postNote', name: 'Twittr Post Note', element: TwittrPostNote },
]

export default routes
