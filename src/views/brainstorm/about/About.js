import { CContainer, CNavLink } from '@coreui/react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { updateNpub } from 'src/redux/features/siteNavigation/slice'

const BrainstormAbout = () => {
  const dispatch = useDispatch()
  const setCurrentNpub = (newNpub) => {
    dispatch(updateNpub(newNpub))
  }
  return (
    <>
      <CContainer>
        <center>
          <h3>About Brainstorm</h3>
        </center>
        <div>
          <p>
            Brainstrom is a playground for application of the tapestry protocol to nostr and Web of
            Trust. This includes the base protocols of the Concept Graph and the Grapevine as well
            as specialized applications such as Wikifreedia. The tapestry protocol is a work in
            progress and may be subject to change, hence the need for this experimental site where
            things may break from time to time.
          </p>
          <p>
            Individual apps may be spun off into standalone websites once they reach a sufficient
            level of maturity.
          </p>
          <p>
            <CNavLink
              href="#/profile"
              onClick={() =>
                setCurrentNpub('npub1u5njm6g5h5cpw4wy8xugu62e5s7f6fnysv0sj0z3a8rengt2zqhsxrldq3')
              }
            >
              <strong>Get in touch!</strong>
            </CNavLink>
          </p>
        </div>
      </CContainer>
    </>
  )
}

export default BrainstormAbout
