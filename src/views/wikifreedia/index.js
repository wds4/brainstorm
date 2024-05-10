import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CCol, CNavLink, CRow, CWidgetStatsF } from '@coreui/react'
import { updateApp } from 'src/redux/features/siteNavigation/slice'
import WikiListener from '../../helpers/listeners/WikiListener'
import { cibWikipedia } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const WikifreediaDashboard = () => {
  const dispatch = useDispatch()
  dispatch(updateApp('wikifreedia'))

  const oWikiArticles = useSelector((state) => state.wikifreedia.articles.byNaddr)
  const oTopics = useSelector((state) => state.wikifreedia.articles.byDTag)
  const oCategories = useSelector((state) => state.wikifreedia.categories)
  return (
    <>
      <WikiListener />
      <center>
        <h3>Wiki Dashboard</h3>
      </center>
      <CRow xs={{ gutter: 4 }}>
        <CCol xs={12} sm={6} xl={4} xxl={3}>
          <CNavLink href="#/wikifreedia/wikiArticles">
            <CWidgetStatsF
              icon={<CIcon width={24} icon={cibWikipedia} size="xl" />}
              title={Object.keys(oTopics).length}
              value="topics"
              color="primary"
            />
          </CNavLink>
        </CCol>
        <CCol xs={12} sm={6} xl={4} xxl={3}>
          <CNavLink href="#/wikifreedia/categories">
            <CWidgetStatsF
              icon={<CIcon width={24} icon={cibWikipedia} size="xl" />}
              title={Object.keys(oCategories).length}
              value="categories"
              color="primary"
            />
          </CNavLink>
        </CCol>
      </CRow>
    </>
  )
}

export default WikifreediaDashboard
