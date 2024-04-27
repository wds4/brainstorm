import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { NDKProvider } from '@nostr-dev-kit/ndk-react'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import { aDefaultRelays } from './const'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.ui.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // keep nostr relays updated based on user profile
  const [ndkProviderRelays, setNdkProviderRelays] = useState(aDefaultRelays)
  const myCurrentProfileKind3Relays = useSelector((state) => state.profile.kind3.relays)
  useEffect(() => {
    if (Object.keys(myCurrentProfileKind3Relays).length > 0) {
      const aRelaysUpdated = []
      Object.keys(myCurrentProfileKind3Relays).forEach((relay, item) => {
        const read = myCurrentProfileKind3Relays[relay]?.read
        if (read) {
          aRelaysUpdated.push(relay)
        }
      })
      setNdkProviderRelays(aRelaysUpdated)
    } else {
      // if user has no active relays, then use the default relays
      setNdkProviderRelays(aDefaultRelays)
    }
  }, [myCurrentProfileKind3Relays])

  return (
    <NDKProvider relayUrls={ndkProviderRelays}>
      <HashRouter>
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </NDKProvider>
  )
}

export default App
