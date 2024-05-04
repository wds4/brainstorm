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
import { addTrustAttestation } from '../../redux/features/grapevine/slice'
import { cutoffTime } from '../../const'

const GrapevineDashboard = () => {
  const oActions = useSelector((state) => state.grapevine.actions)
  const oCategories = useSelector((state) => state.grapevine.categories)
  const oContexts = useSelector((state) => state.grapevine.contexts)
  const oTrustAttestations = useSelector((state) => state.grapevine.trustAttestations)

  const dispatch = useDispatch()

  const filter = {
    since: 0,
    kinds: [9902, 39902],
    since: cutoffTime,
    '#P': ['tapestry'],
  }

  // use ndk-react
  const { fetchEvents } = useNDK()
  useEffect(() => {
    async function updateContextData() {
      const events = await fetchEvents(filter)
      events.forEach((eventNS, item) => {
        const event = eventNS.rawEvent()
        let aTags_w = event.tags.filter(([k, v]) => k === 'w' && v && v !== '')
        if (aTags_w.length > 0) {
          let cid = event.id
          const wordType = aTags_w[0][1]
          if (event.kind >= 30000 && event.kind < 40000) {
            const tag_d = fetchFirstByTag('d', event)
            const naddr = nip19.naddrEncode({
              pubkey: event.pubkey,
              kind: event.kind,
              identifier: tag_d,
              relays: [],
            })
            cid = naddr
          }
          if (wordType == 'action') {
            dispatch(addAction({ event, cid }))
          }
          if (wordType == 'category') {
            dispatch(addCategory({ event, cid }))
          }
          if (wordType == 'context') {
            dispatch(addContext({ event, cid }))
          }
          if (wordType == 'trustAttestation') {
            dispatch(addTrustAttestation({ event, cid }))
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
      <DocsExample href="components/widgets/#cwidgetstatsf">
        <CRow xs={{ gutter: 4 }}>
          <CCol xs={12} sm={6} xl={4} xxl={3}>
            <CNavLink href="#/grapevine/trustAttestations/viewAll">
              <CWidgetStatsF
                icon={<CIcon width={24} icon={cilThumbUp} size="xl" />}
                title={Object.keys(oTrustAttestations).length}
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
