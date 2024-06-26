import React from 'react'

const Dashboard = React.lazy(() => import('src/views/dashboard/Dashboard'))

const AboutBrainstorm = React.lazy(() => import('src/views/brainstorm/about/About'))

const DiredtMessages = React.lazy(() => import('src/views/directMessages/DirectMessages'))
const Notifications = React.lazy(() => import('src/views/notifications/Notifications'))
const FindUser = React.lazy(() => import('src/views/findUser/FindUser'))
const Profiles = React.lazy(() => import('src/views/profiles/Profiles'))
const Profile = React.lazy(() => import('src/views/profile/Profile'))

// Settings
const Settings = React.lazy(() => import('src/views/settings/settings/Settings'))
const Relays = React.lazy(() => import('src/views/settings/relays/Settings'))

// My Profile
const EditMyProfile = React.lazy(() => import('src/views/myProfile/editMyProfile/EditMyProfile'))
const MyProfile = React.lazy(() => import('src/views/myProfile/myProfile/MyProfile'))
const Follows = React.lazy(() => import('src/views/myProfile/follows/Follows'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/about', name: 'About', element: AboutBrainstorm },
  { path: '/directMessages', name: 'Direct Messages', element: DiredtMessages },
  { path: '/notifications', name: 'Notifications', element: Notifications },
  { path: '/findUser', name: 'Find User', element: FindUser },
  { path: '/profile', name: 'Profile', element: Profile },
  { path: '/profiles', name: 'Profiles', element: Profiles },
  { path: '/settings', name: 'Settings', element: Settings, exact: true },
  { path: '/settings/relays', name: 'Relays', element: Relays },
  { path: '/settings/settings', name: 'Settings', element: Settings },
  { path: '/myProfile', name: 'My Profile', element: MyProfile },
  { path: '/profile/editMyProfile', name: 'Edit My Profile', element: EditMyProfile },
  { path: '/myProfile/myProfile', name: 'My Profile', element: MyProfile },
  { path: '/myProfile/follows', name: 'Follows', element: Follows },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
]

export default routes
