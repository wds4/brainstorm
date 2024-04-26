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
} from '@coreui/react'
import { generateSecretKey, getPublicKey, nip19 } from 'nostr-tools'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'

import { COMMON_CONTACT_RELAY } from '../../../helpers/relays'
import { isHex, safeDecode } from '../../../helpers/nip19'
import {
  updateSignedIn,
  updateSignInMethod,
  updateNsec,
  updateNpub,
  updatePubkey,
} from '../../../redux/features/profile/slice'

const LoginWithExtension = () => {
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
          <Link to="/dashboard">
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

  const dispatch = useDispatch()

  const generateNewKey = useCallback(() => {
    const hex = generateSecretKey()
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

  const loginWithNsec = useCallback(() => {
    if (!hexKey) return
    const pubkey = getPublicKey(hexToBytes(hexKey))

    dispatch(updateNsec(nsec))
    dispatch(updatePubkey(pubkey))
    dispatch(updateNpub(npub))
    dispatch(updateSignInMethod('secret'))
    dispatch(updateSignedIn(true))
  }, [hexKey, nsec, pubkey, npub])

  return (
    <>
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCard className="w-50">
              <CCardBody>
                <center>
                  <CCardTitle>Nostr Login</CCardTitle>
                </center>
              </CCardBody>
              <LoginWithExtension />
              <center>
                <CCardTitle>or</CCardTitle>
              </center>
              <CCardBody>
                <CCardTitle>
                  Enter your secret key (nsec), or{' '}
                  <CButton color="secondary" onClick={generateNewKey}>
                    generate new secret
                  </CButton>
                </CCardTitle>
                <CForm>
                  <CFormInput
                    type="text"
                    id="nsecInput"
                    placeholder="nsec or hex"
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
                </CForm>
                <Link to="/dashboard">
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
              </CCardBody>
            </CCard>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Login
