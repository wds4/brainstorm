import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CCol, CNavLink, CRow, CWidgetStatsF } from '@coreui/react'
import { cibWikipedia, cilPencil, cilPeople } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import WikiListener from '../../helpers/listeners/WikiListener'

const NostrapediaHome = () => {
  const signedIn = useSelector((state) => state.profile.signedIn)
  const dispatch = useDispatch()

  const oTopics = useSelector((state) => state.nostrapedia.articles.byDTag)
  const oCategories = useSelector((state) => state.nostrapedia.categories)
  const oAuthors = useSelector((state) => state.nostrapedia.authors)
  const myPubkey = useSelector((state) => state.profile.pubkey)

  let loggedInClassName = 'hide'
  if (signedIn) {
    loggedInClassName = 'show'
  }
  return (
    <>
      <WikiListener />
      <center>
        <h3>Nostrapedia Home</h3>
      </center>
      <br />
      <CRow xs={{ gutter: 4 }}>
        <CCol xs={12} sm={6} xl={4} xxl={3} className={loggedInClassName}>
          <CNavLink href="#/nostrapedia/publish">
            <CWidgetStatsF
              icon={<CIcon width={24} icon={cilPencil} size="xl" />}
              value="Publish an article"
              color="success"
            />
          </CNavLink>
        </CCol>
        <CCol xs={12} sm={6} xl={4} xxl={3}>
          <CNavLink href="#/nostrapedia/topics">
            <CWidgetStatsF
              icon={<CIcon width={24} icon={cibWikipedia} size="xl" />}
              title={Object.keys(oTopics).length}
              value="topics"
              color="primary"
            />
          </CNavLink>
        </CCol>
        <CCol xs={12} sm={6} xl={4} xxl={3}>
          <CNavLink href="#/nostrapedia/categories">
            <CWidgetStatsF
              icon={<CIcon width={24} icon={cibWikipedia} size="xl" />}
              title={Object.keys(oCategories).length}
              value="categories"
              color="primary"
            />
          </CNavLink>
        </CCol>
        <CCol xs={12} sm={6} xl={4} xxl={3}>
          <CNavLink href="#/nostrapedia/authors">
            <CWidgetStatsF
              icon={<CIcon width={24} icon={cilPeople} size="xl" />}
              title={Object.keys(oAuthors).length}
              value="authors"
              color="primary"
            />
          </CNavLink>
        </CCol>
      </CRow>
    </>
  )
}

export default NostrapediaHome
