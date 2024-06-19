import React from 'react'
import { CPopover } from '@coreui/react'
import { nip19 } from 'nostr-tools'
import { ShowTinyAuthorBrainstormProfileImageOnly } from '../components/ShowTinyAuthorBrainstormProfileImageOnly'
import CIcon from '@coreui/icons-react'
import { cilInfo, cilThumbDown, cilThumbUp } from '@coreui/icons'

const WeightedReactionScorePanel = ({ oKind7Results }) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '30px',
          alignItems: 'center',
        }}
      >
        <div className="col-auto">
          <span style={{ marginRight: '5px', fontSize: '24px', color: '#6261cc' }}>
            {(oKind7Results.weightLikes - oKind7Results.weightDislikes).toPrecision(4)}
          </span>
          <CPopover
            content="the Weighted Reaction Score: likes minus dislikes, each of which is weighted by the Influence Score of the reactor"
            placement="right"
            trigger={['hover', 'focus']}
          >
            <span style={{ color: 'grey' }}>
              <CIcon icon={cilInfo} />
            </span>
          </CPopover>
        </div>
        <div className="col-auto">
          <CIcon icon={cilThumbUp} size="lg" style={{ marginRight: '5px' }} />
          {oKind7Results.aLikesByPubkey.map((pk, item) => {
            const npub = nip19.npubEncode(pk)
            return (
              <span key={item}>
                <ShowTinyAuthorBrainstormProfileImageOnly npub={npub} />
              </span>
            )
          })}
        </div>
        <div className="col-auto">
          <CIcon icon={cilThumbDown} size="lg" style={{ marginRight: '5px' }} />
          {oKind7Results.aDislikesByPubkey.map((pk, item) => {
            const npub = nip19.npubEncode(pk)
            return (
              <span key={item}>
                <ShowTinyAuthorBrainstormProfileImageOnly npub={npub} />
              </span>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default WeightedReactionScorePanel
