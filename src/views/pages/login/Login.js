import React, { useCallback, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import {
  CButton,
  CCard,
  CCardBody,
  CContainer,
  CCardTitle,
  CForm,
  CFormInput,
  CRow,
  CCol,
} from '@coreui/react'
import { generateSecretKey, getPublicKey, nip19 } from 'nostr-tools' // for up to date nostr-tools
// import { nip19, generatePrivateKey, getPublicKey } from 'nostr-tools' // for nostr-tools 1.14.0
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'

import { isHex, safeDecode } from '../../../helpers/nip19'
import {
  updateSignedIn,
  updateSignInMethod,
  updateNsec,
  updateHexKey,
  updateNpub,
  updatePubkey,
} from '../../../redux/features/profile/slice'
import { updateLoginRelayUrl } from '../../../redux/features/settings/slice'

const LoginWithExtension = ({ loginPath }) => {
  const [nip07ExtensionAvailable, setNip07ExtensionAvailable] = useState(false)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  const { loginWithNip07 } = useNDK()

  useEffect(() => {
    async function fetchData() {
      if (!window.nostr) {
        setNip07ExtensionAvailable(false)
      }
      if (window.nostr) {
        setNip07ExtensionAvailable(true)
      }
    }
    fetchData()
  }, [])

  async function connectExtension() {
    setLoading(true)
    const user = await loginWithNip07()
    if (user) {
      const myNpub = user.user.npub
      const decoded = nip19.decode(myNpub)
      if (decoded.type == 'npub') {
        const pubkey = decoded.data
        dispatch(updatePubkey(pubkey))
      }
      dispatch(updateNpub(myNpub))
      dispatch(updateSignInMethod('extension'))
      dispatch(updateSignedIn(true))
    }
    setLoading(false)
  }

  if (nip07ExtensionAvailable) {
    return (
      <>
        <CCardBody>
          <CCardTitle>Browser extension detected!</CCardTitle>
          <Link to={loginPath}>
            <CButton
              color="primary"
              className="mt-1"
              active
              tabIndex={-1}
              onClick={() => connectExtension()}
              disabled={loading}
            >
              {loading ? '...' : 'Sign in'}
            </CButton>
          </Link>
        </CCardBody>
      </>
    )
  }
  return (
    <>
      <CCardBody>
        Need to sign in with a browser extension (e.g. getalby, Nos2x, nostr-keyx)
      </CCardBody>
    </>
  )
}

const Login = () => {
  const [oUser, setOUser] = useState({})

  const [error, setError] = useState(false)
  const [nsec, setNsec] = useState('')
  const [hexKey, setHexKey] = useState('')
  const [npub, setNpub] = useState('')
  const [pubkey, setPubkey] = useState('')

  const [privateRelay, setPrivateRelay] = useState('')
  const [loginPath, setLoginPath] = useState('/dashboard?relays=default')

  const dispatch = useDispatch()

  const { loginWithSecret } = useNDK()

  const generateNewKey = useCallback(() => {
    const hex = generateSecretKey() // for up to date nostr-tools
    // const hex = generatePrivateKey() // for nostr-tools 1.14.0
    const pubkey_ = getPublicKey(hex)
    const hexKey_ = bytesToHex(hex)
    const nsec_ = nip19.nsecEncode(hex)
    const npub_ = nip19.npubEncode(pubkey_)
    setHexKey(hexKey_)
    setNsec(nsec_)
    setNpub(npub_)
    setPubkey(pubkey_)
  }, [setHexKey, setNsec])

  const handleInputChange = useCallback(
    (e) => {
      setNsec(e.target.value)

      try {
        let hex = null
        if (isHex(e.target.value)) hex = e.target.value
        else {
          const decode = safeDecode(e.target.value)
          if (decode && decode.type === 'nsec') hex = bytesToHex(decode.data)
        }

        if (hex) {
          const pubkey = getPublicKey(hexToBytes(hex))
          setHexKey(hex)
          setNpub(nip19.npubEncode(pubkey))
          setError(false)
        } else {
          setError(true)
        }
      } catch (e) {
        setError(true)
      }
    },
    [setNsec, setHexKey, setNpub, setError],
  )

  const handlePrivateRelay = useCallback((e) => {
    const relayUrl = e.target.value
    setPrivateRelay(relayUrl)
    dispatch(updateLoginRelayUrl(relayUrl))
    console.log('handlePrivateRelay; relayUrl: ' + relayUrl)
    if (relayUrl) {
      setLoginPath('/dashboard?relays=private')
    } else {
      setLoginPath('/dashboard?relays=default')
    }
  }, [])

  const loginWithNsec = useCallback(async () => {
    if (!hexKey) return

    const pubkey = getPublicKey(hexToBytes(hexKey))

    dispatch(updateNsec(nsec))
    dispatch(updateHexKey(hexKey))
    dispatch(updatePubkey(pubkey))
    dispatch(updateNpub(npub))
    dispatch(updateSignInMethod('secret'))
    dispatch(updateSignedIn(true))
  }, [hexKey, nsec, pubkey, npub])

  return (
    <>
      <CContainer md style={{ marginTop: '20px' }}>
        <CRow className="justify-content-center">
          <div className="col-auto">
            <CCard className="w-80">
              <CCardBody>
                <center>
                  <CCardTitle>Nostr Login</CCardTitle>
                </center>
              </CCardBody>
              <LoginWithExtension loginPath={loginPath} />
              <center>
                <CCardTitle>or</CCardTitle>
              </center>
              <CCardBody>
                <CCardTitle>
                  <CRow>
                    <CCol>Enter your secret key (nsec), or </CCol>
                    <CCol>
                      <CButton color="secondary" onClick={generateNewKey}>
                        generate new secret
                      </CButton>
                    </CCol>
                  </CRow>
                </CCardTitle>
                <CForm>
                  <CFormInput
                    type="text"
                    id="nsecInput"
                    placeholder="nsec (to do: allow nsec or hex)"
                    required
                    value={nsec}
                    onChange={handleInputChange}
                    invalid={error}
                  />
                  <br />
                  <CFormInput
                    type="text"
                    id="npubInput"
                    label="pubkey (npub)"
                    placeholder="npub..."
                    readOnly
                    disabled
                    value={npub}
                  />
                  <Link to={loginPath}>
                    <CButton
                      color="primary"
                      className="mt-3"
                      active
                      tabIndex={-1}
                      onClick={loginWithNsec}
                    >
                      Sign in
                    </CButton>
                  </Link>
                </CForm>
              </CCardBody>
            </CCard>
          </div>
        </CRow>
      </CContainer>
    </>
  )
}

export default Login

/*
                  <hr />
                  <div>OPTIONAL / EXPERIMENTAL:</div>
                  <div>
                    Currently, the relay list is static. Eventually we will enable dynamic relay
                    management in the Settings. But for now ...
                  </div>
                  <div>
                    If the below field is empty, a set of default relays will be used. If filled in,
                    only that relay will be used.
                  </div>
                  <div>
                    Use this if experimenting with the Concept Graph and if you have your own relay.
                  </div>
                  <div>ws://umbrel.local:4848</div>
                  <CFormInput
                    type="text"
                    placeholder="wss://..."
                    label="Enter your private relay:"
                    value={privateRelay}
                    onChange={handlePrivateRelay}
                  />
                  */
