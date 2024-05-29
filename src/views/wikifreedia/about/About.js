import { cibGit, cibGithub } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CContainer, CNavLink } from '@coreui/react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { updateNpub } from 'src/redux/features/siteNavigation/slice'

const NostrapediaAbout = () => {
  const dispatch = useDispatch()
  const setCurrentNpub = (newNpub) => {
    dispatch(updateNpub(newNpub))
  }
  return (
    <>
      <CContainer>
        <center>
          <h3>About Nostrapedia</h3>
        </center>
        <br />
        <br />
        <div>
          Nostrapedia is an implementation of{' '}
          <a
            target="_blank"
            href="https://github.com/nostr-protocol/nips/blob/master/54.md"
            rel="noreferrer"
          >
            NIP-54
          </a>{' '}
          with a focus on bringing web of trust to nostr. See also{' '}
          <a target="_blank" href="https://wikifreedia.lol" rel="noreferrer">
            Wikifreedia
          </a>{' '}
          and{' '}
          <a target="_blank" href="https://wikistr.com" rel="noreferrer">
            Wikistr
          </a>
          .
        </div>
        <br />
        <br />
        <center>
          <h4>WoT scores</h4>
        </center>
        <div>
          <p>
            Alice's WoT score is equal to the number of users who meet two criteria: you follow that
            user, and that user follows Alice. This method is the same or similar to the method used
            by{' '}
            <a target="_blank" href="https://coracle.social" rel="noreferrer">
              Coracle
            </a>{' '}
            and{' '}
            <a target="_blank" href="https://wikifreedia.lol" rel="noreferrer">
              Wikifreedia
            </a>
            , with the caveat that Nostrapedia does not (yet) take the mute list into account.
          </p>
          <p>
            The WoT is quite useful for screening out noise generated by bots and other bad actors.
            However, it has several disadvantages:
            <li>Any profile more than two hops away from you will have a WoT score of zero.</li>
            <li>It does not distinguish based on context.</li>
            <li>It's still a bit of a popularity contest.</li>
          </p>
        </div>
        <br />
        <br />
        <center>
          <h4>Influence scores</h4>
        </center>
        <div>
          <p>
            The influence score is designed to address the above shortcomings. Like the WoT above,
            the Influence Score as currently implemented is based on follows and mutes. Howewver,
            the algorithm is designed to synthesize data from multiple sources at once, including
            contextual trust attestations. (Provide link to more in depth explanation.)
          </p>
          <p>
            Advantages include:
            <li>extends beyond 2 hops</li>
            <li>
              ability to synthesize data from multiple sources, including contextual attestations
            </li>
            <li>different scores for different purposes and contexts</li>
          </p>
          <p>
            Disadvantages include:
            <li>computationally expensive</li>
          </p>
        </div>
      </CContainer>
    </>
  )
}

export default NostrapediaAbout
