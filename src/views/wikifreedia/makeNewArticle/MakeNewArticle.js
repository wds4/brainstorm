import React, { useCallback, useEffect, useState } from 'react'
import MarkdownEditor from '@uiw/react-markdown-editor'
import Markdown from 'react-markdown'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CFormSwitch,
  CRow,
} from '@coreui/react'
import { nip19 } from 'nostr-tools'
import { useSelector } from 'react-redux'
import RawData from './RawData'
import { ShowAuthor } from '../components/ShowAuthor'
import { signEventPGA } from 'src/helpers/signers'
import { useNostr } from 'nostr-react'
import { fetchFirstByTag } from 'src/helpers'

const mdStr = `# Test Entry  \n## Subtitle \n\nLorem Ipsum \n\nCreated using [brainstorm.ninja](https://brainstorm.ninja)`

const oEventDefault = {
  id: null,
  kind: 30818,
  content: '',
  tags: [],
  pubkey: null,
  created_at: null,
  sig: null,
}

const Editor = ({ markdown, setMarkdown }) => {
  return <MarkdownEditor value={mdStr} onChange={(value, viewUpdate) => setMarkdown(value)} />
}

const DisplayCategory = ({ oEvent }) => {
  let category = fetchFirstByTag('c', oEvent)
  if (!category) {
    return <></>
  }
  return (
    <div style={{ textAlign: 'right' }}>
      <span style={{ color: 'grey' }}>category: </span>
      <span>{category}</span>
    </div>
  )
}

const PreviewWiki = ({ oEvent, showWikiPreviewButton, markdown, topicTitle, topicSlug, npub }) => {
  if (showWikiPreviewButton == 'hide') {
    return <></>
  }
  return (
    <>
      <center>
        <h1>
          <strong>{topicTitle}</strong>
        </h1>
      </center>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <DisplayCategory oEvent={oEvent} />
              <CRow style={{ display: 'flex', alignItems: 'center' }}>
                <CCol xs="auto" className="me-auto">
                  <ShowAuthor npub={npub} />
                </CCol>
                <CCol xs="auto" className="align-self-center" style={{ color: 'grey' }}>
                  {topicSlug}
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <Markdown>{markdown}</Markdown>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

const MakeNewWikiArticle = () => {
  const [markdown, setMarkdown] = useState(mdStr)
  const [oEvent, setOEvent] = useState({})
  const [naddr, setNaddr] = useState('')
  const [category, setCategory] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [topicTitle, setTopicTitle] = useState('Test')
  const [topicSlug, setTopicSlug] = useState('test')
  const [showRawDataButton, setShowRawDataButton] = useState('hide')
  const [showWikiPreviewButton, setShowWikiPreviewButton] = useState('hide')
  const oWikiCategories = useSelector((state) => state.wikifreedia.categories)
  const aWikiCategories = Object.keys(oWikiCategories)
  const oProfile = useSelector((state) => state.profile)
  const myPubkey = useSelector((state) => state.profile.pubkey)

  const npub = nip19.npubEncode(myPubkey)

  const { publish } = useNostr()

  async function makeWord(oProfile, markdown, topicSlug, topicTitle, category, newCategory) {
    const currentTime = Math.floor(Date.now() / 1000)
    const aTags = []
    aTags.push(['d', topicSlug])
    aTags.push(['title', topicTitle])
    if (category) {
      aTags.push(['c', category])
    } else {
      if (newCategory) {
        aTags.push(['c', newCategory])
      }
    }
    aTags.push(['published_at', JSON.stringify(currentTime)])
    const note = oEventDefault
    note.kind = 30818
    note.content = markdown
    note.tags = aTags
    note.created_at = currentTime
    const note_signed = await signEventPGA(oProfile, note)
    setOEvent(note_signed)
    return note_signed
  }

  useEffect(() => {
    async function createKind30818Note() {
      try {
        const currentTime = Math.floor(Date.now() / 1000)
        const aTags = []
        aTags.push(['d', topicSlug])
        aTags.push(['title', topicTitle])
        if (category) {
          aTags.push(['c', category])
        } else {
          if (newCategory) {
            aTags.push(['c', newCategory])
          }
        }
        aTags.push(['published_at', currentTime])
        const note = oEventDefault
        note.kind = 30818
        note.content = markdown
        note.tags = aTags
        note.created_at = currentTime
        const note_signed = await signEventPGA(oProfile, note)
        setOEvent(note_signed)
      } catch (e) {
        console.log('createKind30818Note error: ' + e)
      }
    }
    createKind30818Note()
  }, [markdown, category, newCategory, topicTitle, topicSlug])

  useEffect(() => {
    function updateNaddr() {
      try {
        const naddr = nip19.naddrEncode({
          pubkey: myPubkey,
          kind: 30818,
          identifier: topicTitle,
          relays: [],
        })
        setNaddr(naddr)
      } catch (e) {
        console.log('updateNaddr error: ' + e)
      }
    }
    updateNaddr()
  }, [topicSlug])

  const toggleShowRawData = useCallback(
    (e) => {
      if (showRawDataButton == 'hide') {
        setShowRawDataButton('show')
      }
      if (showRawDataButton == 'show') {
        setShowRawDataButton('hide')
      }
    },
    [showRawDataButton],
  )

  const toggleShowWikiPreview = useCallback(
    (e) => {
      if (showWikiPreviewButton == 'hide') {
        setShowWikiPreviewButton('show')
      }
      if (showWikiPreviewButton == 'show') {
        setShowWikiPreviewButton('hide')
      }
    },
    [showWikiPreviewButton],
  )

  const updateTitle = useCallback(
    async (e) => {
      const newTopicTitle = e.target.value
      setTopicTitle(newTopicTitle)
      setTopicSlug(newTopicTitle.replace(' ', '-').toLowerCase())
    },
    [topicTitle, topicSlug],
  )

  const createNewCategory = useCallback(
    async (e) => {
      setNewCategory(e.target.value)
      setCategory('')
      const elem = document.getElementById('existingCategorySelector')
      elem.selectedIndex = ''
    },
    [category, newCategory],
  )

  const updateCategory = useCallback(
    async (e) => {
      const newCategory = e.target.value
      setCategory(newCategory)
      setNewCategory('')
    },
    [category, newCategory],
  )

  const publishKind30818Note = useCallback(async () => {
    const oNote = await makeWord(oProfile, markdown, topicSlug, topicTitle, category, newCategory)
    publish(oNote)
  }, [oProfile, markdown, topicSlug, topicTitle, category, newCategory])

  const handlePreviewButton = useCallback(
    (e) => {
      console.log('handlePreviewButton')
    },
    [oEvent],
  )

  return (
    <>
      <CContainer fluid style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              flexGrow: '1',
              textAlign: 'center',
            }}
          >
            Title:
          </div>
          <div
            style={{
              flexGrow: '999',
            }}
          >
            <CFormInput type="text" value={topicTitle} onChange={updateTitle} />
          </div>
        </div>
        <Editor markdown={markdown} setMarkdown={setMarkdown} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              flexGrow: '1',
              textAlign: 'center',
            }}
          >
            Category:
          </div>
          <div
            style={{
              flexGrow: 'auto',
              alignItems: 'center',
            }}
          >
            <CFormSelect
              id="existingCategorySelector"
              onChange={(e) => {
                updateCategory(e)
              }}
            >
              <option value="disabled" selected disabled>
                select category
              </option>
              <option value="">-- no category --</option>
              {aWikiCategories.map((category) => {
                return (
                  <option key={category} value={category}>
                    {category}
                  </option>
                )
              })}
            </CFormSelect>
          </div>
          <div
            style={{
              flexGrow: '999',
            }}
          >
            <CFormInput
              placeholder="create new category"
              type="text"
              value={newCategory}
              onChange={createNewCategory}
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              flexGrow: 'auto',
            }}
          >
            <CButton
              style={{ display: 'inline-block' }}
              color="primary"
              onClick={publishKind30818Note}
            >
              Publish your wiki entry!
            </CButton>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '20px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              flexGrow: 'auto',
            }}
          >
            <CFormSwitch onChange={(e) => toggleShowWikiPreview(e)} label="Preview Wiki" />
          </div>
          <div
            style={{
              flexGrow: 'auto',
            }}
          >
            <CFormSwitch onChange={(e) => toggleShowRawData(e)} label="raw JSON" />
          </div>
        </div>
        <PreviewWiki
          oEvent={oEvent}
          showWikiPreviewButton={showWikiPreviewButton}
          markdown={markdown}
          topicTitle={topicTitle}
          topicSlug={topicSlug}
          npub={npub}
        />
        <RawData showRawDataButton={showRawDataButton} oEvent={oEvent} naddr={naddr} />
      </CContainer>
    </>
  )
}

export default MakeNewWikiArticle
