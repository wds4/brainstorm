import React from 'react'
import { useSelector } from 'react-redux'
import TwittrNote from 'src/views/twittr/components/twittrNote'
import { CContainer } from '@coreui/react'
import TwittrListener from '../../../helpers/listeners-ndk-react/TwittrListener'

const MainFeed = () => {
  const aFollows = useSelector((state) => state.profile.kind3.follows)

  const oKind1Events = useSelector((state) => state.twittr.mainFeed.events)
  const aCompositeIdentifiers = Object.keys(oKind1Events)
  aCompositeIdentifiers.sort().reverse()

  return (
    <>
      <center>
        <h3>Twittr Main Feed</h3>
      </center>
      <CContainer>
        {aCompositeIdentifiers.map((compositeIdentifier, item) => {
          if (item < 100) {
            return <TwittrNote key={item} event={oKind1Events[compositeIdentifier]} />
          } else {
            return <></>
          }
        })}
      </CContainer>
    </>
  )
}

export default MainFeed

// <TwittrListener aFollows={aFollows} />
