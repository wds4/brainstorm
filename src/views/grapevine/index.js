import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAction, addCategory, addContext } from 'src/redux/features/grapevine/slice'
import { nip19 } from 'nostr-tools'
import { fetchFirstByTag } from 'src/helpers'
import { useNDK } from '@nostr-dev-kit/ndk-react'
import { CCardTitle, CCol, CNavLink, CRow, CWidgetStatsF } from '@coreui/react'
import { DocsExample } from 'src/components'
import CIcon from '@coreui/icons-react'
import { cilBolt, cilBoltCircle, cilCircle, cilSettings, cilThumbUp, cilUser } from '@coreui/icons'

const GrapevineDashboard = () => {
  const oActions = useSelector((state) => state.grapevine.actions)
  const oCategories = useSelector((state) => state.grapevine.categories)
  const oContexts = useSelector((state) => state.grapevine.contexts)

  const dispatch = useDispatch()

  const filter = {
    since: 0,
    kinds: [9902, 39902],
    '#P': ['tapestry'],
  }

  // use ndk-react
  const { fetchEvents } = useNDK()
  useEffect(() => {
    async function updateContextData() {
      const events = await fetchEvents(filter)
      events.forEach((eventNS, item) => {
        /*
        const event = {}
        event.id = eventNS.id
        event.kind = eventNS.kind
        event.tags = eventNS.tags
        event.content = eventNS.content
        event.pubkey = eventNS.pubkey
        event.sig = eventNS.sig
        event.created_at = eventNS.created_at
        */
        const event = eventNS.rawEvent()
        let aTags_w = event.tags.filter(([k, v]) => k === 'w' && v && v !== '')
        if (aTags_w.length > 0) {
          let cid = event.id
          if (event.kind >= 30000 && event.kind < 40000) {
            const name = fetchFirstByTag('name', event)
            const naddr = nip19.naddrEncode({
              pubkey: event.pubkey,
              kind: event.kind,
              identifier: name,
              relays: [],
            })
            cid = naddr
          }
          const wordType = aTags_w[0][1]
          if (wordType == 'action') {
            dispatch(addAction({ event, cid }))
          }
          if (wordType == 'category') {
            dispatch(addCategory({ event, cid }))
          }
          if (wordType == 'context') {
            dispatch(addContext({ event, cid }))
          }
        }
      })
    }
    updateContextData()
  }, [fetchEvents(filter)])

  return (
    <>
      <center>
        <h3>Grapevine Dashboard</h3>
        <div>This app is under construction!</div>
      </center>
      <br />
      <div className="d-grid gap-2 col-8 mx-auto">
        The Grapevine enables you and your community to identify who is the most trustworthy, and in
        what context, to curate content, facts, and information.
      </div>
      <DocsExample href="components/widgets/#cwidgetstatsf">
        <CRow xs={{ gutter: 4 }}>
          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CNavLink href="#/grapevine/trustAttestations/viewAll">
              <CWidgetStatsF
                icon={<CIcon width={24} icon={cilThumbUp} size="xl" />}
                title="0"
                value="trust attestations"
                color="primary"
              />
            </CNavLink>
          </CCol>
          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CNavLink href="#/grapevine/contexts/viewAll">
              <CWidgetStatsF
                icon={<CIcon width={24} icon={cilBoltCircle} size="xl" />}
                title={Object.keys(oContexts).length}
                value="contexts"
                color="info"
              />
            </CNavLink>
          </CCol>
          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CNavLink href="#/grapevine/actions/viewAll">
              <CWidgetStatsF
                icon={<CIcon width={24} icon={cilBolt} size="xl" />}
                title={Object.keys(oActions).length}
                value="actions"
                color="info"
              />
            </CNavLink>
          </CCol>
          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CNavLink href="#/grapevine/categories/viewAll">
              <CWidgetStatsF
                icon={<CIcon width={24} icon={cilCircle} size="xl" />}
                title={Object.keys(oCategories).length}
                value="categories"
                color="info"
              />
            </CNavLink>
          </CCol>
        </CRow>
      </DocsExample>
    </>
  )
}

export default GrapevineDashboard
