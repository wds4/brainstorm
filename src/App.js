import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { NDKProvider } from '@nostr-dev-kit/ndk-react'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import { aDefaultRelays } from './const'
import { NostrProvider } from 'nostr-react'

// import { Buffer } from 'buffer'
// window.Buffer = Buffer

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
  const aActiveRelays = useSelector((state) => state.settings.general.aActiveRelays)
  const loginRelayUrl = useSelector((state) => state.settings.general.loginRelayUrl)
  let aStarterRelays = aDefaultRelays
  if (loginRelayUrl) {
    aStarterRelays = [loginRelayUrl]
  }
  const [ndkProviderRelays, setNdkProviderRelays] = useState(aStarterRelays)

  /*
  // const aMyPersonalTestRelay = ['ws://umbrel.local:4848']
  // const [ndkProviderRelays, setNdkProviderRelays] = useState(aMyPersonalTestRelay)

  // for some reason this does not seem to result in a change in relays.
  // For now, user will have to log out / log back in after making changes to active relay groups
  useEffect(() => {
    if (aActiveRelays.length > 0) {
      setNdkProviderRelays(aActiveRelays)
    } else {
      // if user has no active relays, then use the default relays
      setNdkProviderRelays(aActiveRelays)
    }
  }, [aActiveRelays])
  */

  return (
    <NDKProvider relayUrls={ndkProviderRelays}>
      <NostrProvider relayUrls={ndkProviderRelays} debug={false}>
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
      </NostrProvider>
    </NDKProvider>
  )
}

export default App

/*
    <NDKProvider relayUrls={ndkProviderRelays}>
      <NostrProvider relayUrls={ndkProviderRelays} debug={false}>
      </NostrProvider>
    </NDKProvider>

*/
