import { cibGit, cibGithub } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
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
          <h3>About PGA: Brainstorm</h3>
          <div>Pretty Good Apps</div>
        </center>
        <br />
        <br />
        <div>
          <p>
            Following{' '}
            <a
              target="_blank"
              href="https://habla.news/a/naddr1qvzqqqr4gupzpef89h53f0fsza2ugwdc3e54nfpun5nxfqclpy79r6w8nxsk5yp0qqxnzdesxqerwvesxvmn2dpj5hl046"
              rel="noreferrer"
            >
              this roadmap
            </a> to bring Web of Trust to nostr.
          </p>
          <p>
            This website serves as a playground for application of the{' '}
            <a target="_blank" href="https://pgf.tech" rel="noreferrer">
              tapestry protocol
            </a>{' '}
            to nostr. This protocol is a work in progress and may be subject to change, hence the
            need for this experimental site where things may break from time to time.
          </p>
          <p>
            Individual apps may be spun off into standalone websites once they reach a sufficient
            level of maturity.
          </p>
          <p>
            Soon to come: calculation of a Web of Trust score according to the principles outlined
            in{' '}
            <a
              target="_blank"
              href="https://habla.news/a/naddr1qqxnzdes8q6rwv3hxs6rjvpeqgs98k45ww24g26dl8yatvefx3qrkaglp2yzu6dm3hv2vcxl822lqtgrqsqqqa28kn8wur"
              rel="noreferrer"
            >
              this post in habla.news
            </a>
            .
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
          <p>
            See the repo on{' '}
            <a href="https://github.com/wds4/brainstorm" target="_blank" rel="noopener noreferrer">
              <CIcon icon={cibGithub} size="lg" />
            </a>
          </p>
        </div>
      </CContainer>
    </>
  )
}

export default BrainstormAbout
