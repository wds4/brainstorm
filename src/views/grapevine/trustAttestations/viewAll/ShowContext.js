import React from 'react'
import { CCardBody, CNavLink } from '@coreui/react'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { nip19 } from 'nostr-tools'
import { fetchFirstByTag } from '../../../../helpers'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { updateViewContextId } from '../../../../redux/features/siteNavigation/slice'

// eslint-disable-next-line react/prop-types
export const ShowContext = ({ contextId, event }) => {
  const dispatch = useDispatch()
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
  const updateViewContext = (newContextId) => {
    dispatch(updateViewContextId(newContextId))
    console.log('updateViewContext; newContextId: ' + newContextId)
  }
  return (
    <CCardBody>
      <Link onClick={() => updateViewContext(contextId)} to="/grapevine/contexts/viewSingle">
        <small style={{ textDecoration: 'underline' }}>Context:</small>
      </Link>
      <Link
        onClick={() => updateViewContext(contextId)}
        to="/grapevine/contexts/viewSingle"
        style={{ float: 'right' }}
      >
        more info
      </Link>
      <br />
      <large>{contextName}</large>
      <br />
      <small>{contextDescription}</small>
    </CCardBody>
  )
}
