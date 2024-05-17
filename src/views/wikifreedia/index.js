import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CCol, CNavLink, CRow, CWidgetStatsF } from '@coreui/react'
import { updateApp } from 'src/redux/features/siteNavigation/slice'
import { cibWikipedia, cilPencil, cilPeople } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  turnListenerOn,
  updateFilter,
  updateFilterAuthors,
  updateFilterKinds,
  updateListenerApplication,
} from '../../redux/features/listenerManager/slice'
import WikiListener from '../../helpers/listeners/WikiListener'

const WikiHome = () => {
  const signedIn = useSelector((state) => state.profile.signedIn)
  const dispatch = useDispatch()

  // manage listener
  const filter = {
    kinds: [30818],
  }

  dispatch(updateApp('wiki'))
  dispatch(updateFilter(filter))
  dispatch(turnListenerOn())
  dispatch(updateListenerApplication('wiki'))

  const oTopics = useSelector((state) => state.wikifreedia.articles.byDTag)
  const oCategories = useSelector((state) => state.wikifreedia.categories)
  const oAuthors = useSelector((state) => state.wikifreedia.authors)
  const myPubkey = useSelector((state) => state.profile.pubkey)

  let loggedInClassName = 'hide'
  if (signedIn) {
    loggedInClassName = 'show'
  }
  /*
  let numArticlesByMe = 'Time to write your first one!'
  if (oAuthors[myPubkey]) {
    numArticlesByMe = oAuthors[myPubkey].length + ' so far'
  }
  */
  return (
    <>
      <WikiListener />
      <center>
        <h3>Wiki Home</h3>
      </center>
      <br />
      <CRow xs={{ gutter: 4 }}>
        <CCol xs={12} sm={6} xl={4} xxl={3} className={loggedInClassName}>
          <CNavLink href="#/wikifreedia/publish">
            <CWidgetStatsF
              icon={<CIcon width={24} icon={cilPencil} size="xl" />}
              value="Publish an article"
              color="success"
            />
          </CNavLink>
        </CCol>
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
        <CCol xs={12} sm={6} xl={4} xxl={3}>
          <CNavLink href="#/wikifreedia/authors">
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

export default WikiHome
