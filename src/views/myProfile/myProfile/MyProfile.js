import React from 'react'
import { useSelector } from 'react-redux'
import CIcon from '@coreui/icons-react'
import { cilClone } from '@coreui/icons'

const MyProfile = () => {
  const oMyProfile = useSelector((state) => state.profile)

  const copyNpubToClipboard = (np) => {
    navigator.clipboard.writeText(np)
    alert('user npub copied to clipboard: \n ' + np)
  }
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-5 profileAvatarContainer">
          <img src={oMyProfile?.picture} className="profileAvatarLarge" />
        </div>
        <div className="col" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="col-auto" style={{ fontSize: '34px', overflowWrap: 'break-word' }}>
              {oMyProfile?.display_name}
            </div>
            <div className="col-auto" style={{ color: 'grey' }}>
              @{oMyProfile?.name}
            </div>
            <div className="col-auto">{oMyProfile?.nip05}</div>
            <div className="col">
              <a href={oMyProfile?.website} target="_blank" rel="noreferrer">
                {oMyProfile?.website}
              </a>
            </div>
          </div>
          <div style={{ color: 'grey', marginBottom: '12px', overflowWrap: 'break-word' }}>
            {oMyProfile?.npub}{' '}
            <CIcon
              icon={cilClone}
              className="me-2"
              onClick={() => copyNpubToClipboard(oMyProfile?.npub)}
            />
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>
  )
}

export default MyProfile
