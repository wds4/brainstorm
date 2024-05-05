import React from 'react'
import { CCardBody, CNavLink } from '@coreui/react'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { nip19 } from 'nostr-tools'
import { fetchFirstByTag } from '../../../../helpers'
import { useSelector } from 'react-redux'

// eslint-disable-next-line react/prop-types
export const ShowContext = ({ event }) => {
  const oContexts = useSelector((state) => state.grapevine.contexts)
  const context = fetchFirstByTag('c', event)
  let contextText = context
  if (!oContexts[context]) {
    return (
      <CCardBody>
        <small style={{ textDecoration: 'underline' }}>Context:</small>
        <br />
        <large>{context}</large>
      </CCardBody>
    )
  }
  const oContextEvent = oContexts[context]
  const contextName = fetchFirstByTag('name', oContextEvent)
  const contextDescription = fetchFirstByTag('description', oContextEvent)
  return (
    <CCardBody>
      <small style={{ textDecoration: 'underline' }}>Context:</small>
      <br />
      <large>{contextName}</large>
      <br />
      <small>{contextDescription}</small>
    </CCardBody>
  )
}
