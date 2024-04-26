import React from 'react'

import MainChart from './MainChart'
import { cibGithub } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const Dashboard = () => {
  return (
    <>
      <center>
        <h3>
          CoreUI Nostr React Admin Template{' '}
          <a
            href="https://github.com/wds4/coreui-nostr-free-react-admin-template-B"
            target="_blank"
            rel="noreferrer"
          >
            <CIcon icon={cibGithub} size="lg" />
          </a>
        </h3>
      </center>
      <center>
        <h4>Fork this template and build your own nostr app!</h4>
      </center>
    </>
  )
}

export default Dashboard
