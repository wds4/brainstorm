import React from 'react'
import { CFooter } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cibGithub, cilHeart } from '@coreui/icons'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <span className="me-1">
        made with <CIcon icon={cilHeart} size="lg" /> by{' '}
        <a
          href="https://primal.net/p/npub1u5njm6g5h5cpw4wy8xugu62e5s7f6fnysv0sj0z3a8rengt2zqhsxrldq3"
          target="_blank"
          rel="noopener noreferrer"
        >
          david
        </a>
      </span>
      <div className="ms-auto">
        <span className="ms-1">
          &copy; 2024{' '}
          <a target="_blank" href="https://pgf.tech">
            Pretty Good Freedom Tech
          </a>
        </span>{' '}
        <a href="https://github.com/wds4/brainstorm" target="_blank" rel="noopener noreferrer">
          <CIcon icon={cibGithub} size="lg" />
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
