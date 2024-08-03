import React from 'react'
import { CButton, CContainer } from '@coreui/react'
import { useSelector } from 'react-redux'
import WikiArticlesContent from './content'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import WikiListener from '../../../helpers/listeners-ndk-react/WikiListener'

const WikiTopics = () => {
  const signedIn = useSelector((state) => state.profile.signedIn)

  let loggedInClassName = 'hide'
  if (signedIn) {
    loggedInClassName = 'show'
  }

  return (
    <>
      <CContainer fluid>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ float: 'right' }} className={loggedInClassName}>
            <CButton color="success" href="#/nostrapedia/publish">
              <CIcon icon={cilPencil} /> Write an article
            </CButton>
          </div>
          <center>
            <h3>Topics</h3>
          </center>
        </div>
        <WikiArticlesContent />
      </CContainer>
      <WikiListener />
    </>
  )
}

export default WikiTopics
