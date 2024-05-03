import React, { useCallback, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormInput,
  CFormSwitch,
  CFormTextarea,
  CCardTitle,
} from '@coreui/react'
import { fetchFirstByTag } from '../../../../helpers'
import { signEventPGA } from '../../../../helpers/signers'
import { useSelector } from 'react-redux'
import ActionSelector from './actionSelector'
import CategorySelector from './categorySelector'
import { useNostr } from 'nostr-react'

// eslint-disable-next-line react/prop-types
const RawData = ({ showRawDataButton, oEvent }) => {
  if (showRawDataButton == 'hide') {
    return <></>
  }
  const sWord = fetchFirstByTag('word', oEvent)
  const oWord = JSON.parse(sWord)
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>raw JSON, word type: context, tapestry protocol (experimental)</strong>
        </CCardHeader>
        <CCardBody>
          <pre>{JSON.stringify(oWord, null, 4)}</pre>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>raw nostr event</strong>
        </CCardHeader>
        <CCardBody>
          <pre>{JSON.stringify(oEvent, null, 4)}</pre>
        </CCardBody>
      </CCard>
    </>
  )
}

const oEventDefault = {
  content: '',
  kind: 39902,
  tags: [
    ['P', 'tapestry'],
    ['word', '{}'],
    ['wordType', 'context'],
    ['w', 'context'],
    ['name', ''],
    ['description', ''],
    ['action', ''],
    ['category', ''],
    ['d', 'context:' + ''],
  ],
  created_at: null,
}

async function makeWord(
  oProfile,
  oActions,
  oCategories,
  name,
  description,
  selectedAction,
  selectedCategory,
  makeEditable,
) {
  const actionEvent = oActions[selectedAction]
  const categoryEvent = oCategories[selectedCategory]
  let actionName = fetchFirstByTag('name', actionEvent)
  let categoryName = fetchFirstByTag('name', categoryEvent)
  if (!actionEvent) {
    actionName = 'for all actions'
  }
  if (!categoryEvent) {
    categoryName = 'in all categories'
  }
  const oWord = {
    contextData: {
      name: name,
      description: description,
      action: {
        eventId: actionEvent?.id,
        name: actionName,
      },
      category: {
        eventId: categoryEvent?.id,
        name: categoryName,
      },
      transitive: true,
    },
  }
  if (actionEvent && actionEvent.kind >= 30000 && actionEvent.kind < 40000) {
    oWord.contextData.action.naddr = selectedAction
  }
  if (categoryEvent && categoryEvent.kind >= 30000 && categoryEvent.kind < 40000) {
    oWord.contextData.category.naddr = selectedCategory
  }
  const sWord = JSON.stringify(oWord)
  let oEvent = oEventDefault
  oEvent.kind = 39902
  if (!makeEditable) {
    oEvent.kind = 9902
  }
  const tags = [
    ['P', 'tapestry'],
    ['word', sWord],
    ['wordType', 'context'],
    ['w', 'context'],
    ['name', name],
    ['description', description],
    ['action', selectedAction, actionName],
    ['category', selectedCategory, categoryName],
    ['d', 'context:' + selectedAction + ':' + selectedCategory],
  ]
  oEvent.tags = tags
  oEvent.created_at = Math.floor(Date.now() / 1000)
  // const oEvent_signed = await window.nostr.signEvent(oEvent)
  const oEvent_signed = await signEventPGA(oProfile, oEvent)
  return oEvent_signed
}

const MakeNewContext = () => {
  const oActions = useSelector((state) => state.grapevine.actions)
  const oCategories = useSelector((state) => state.grapevine.categories)
  const oProfile = useSelector((state) => state.profile)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedAction, setSelectedAction] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [makeEditable, setMakeEditable] = useState(true)
  const [oEvent, setOEvent] = useState(oEventDefault)
  const [showRawDataButton, setShowRawDataButton] = useState('hide')
  const [submitEventButtonClassName, setSubmitEventButtonClassName] = useState('mt-3')
  const [createAnotherElementClassName, setCreateAnotherElementClassName] = useState('hide')

  const { publish } = useNostr()

  const publishNewEvent = useCallback(async () => {
    publish(oEvent)
    setSubmitEventButtonClassName('hide')
    setCreateAnotherElementClassName('show')
  }, [name, description, oEvent])
  const createAnotherContextButton = useCallback(() => {
    setSubmitEventButtonClassName('mt-3')
    setCreateAnotherElementClassName('hide')
    clearFields()
  }, [name, description, oEvent])
  const handleNameChange = useCallback(
    async (e) => {
      const newName = e.target.value
      setName(newName)
      const oEvent = await makeWord(
        oProfile,
        oActions,
        oCategories,
        newName,
        description,
        selectedAction,
        selectedCategory,
        makeEditable,
      )
      setOEvent(oEvent)
    },
    [name, description, selectedAction, selectedCategory, makeEditable],
  )
  const handleDescriptionChange = useCallback(
    async (e) => {
      const newDescription = e.target.value
      setDescription(newDescription)
      const oEvent = await makeWord(
        oProfile,
        oActions,
        oCategories,
        name,
        newDescription,
        selectedAction,
        selectedCategory,
        makeEditable,
      )
      setOEvent(oEvent)
    },
    [name, description, selectedAction, selectedCategory, makeEditable],
  )
  const toggleMakeEditable = useCallback(
    async (e) => {
      if (makeEditable) {
        setMakeEditable(false)
      } else {
        setMakeEditable(true)
      }
      const oEvent = await makeWord(
        oProfile,
        oActions,
        oCategories,
        name,
        description,
        selectedAction,
        selectedCategory,
        !makeEditable,
      )
      setOEvent(oEvent)
    },
    [name, description, selectedAction, selectedCategory, makeEditable],
  )
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
  const clearFields = useCallback(async (e) => {
    setName('')
    setDescription('')
    setSelectedAction('')
    setSelectedCategory('')
    setMakeEditable(true)
    const oEvent = await makeWord(oProfile, oActions, oCategories, '', '', '', '', true)
    setOEvent(oEvent)
  }, [])
  let makeEditableState = 'NO'
  if (makeEditable) {
    makeEditableState = 'YES'
  }
  const autoCompleteName = useCallback(
    async (selectedAction, selectedCategory) => {
      const actionEvent = oActions[selectedAction]
      const categoryEvent = oCategories[selectedCategory]
      let actionName = fetchFirstByTag('name', actionEvent)
      let categoryName = fetchFirstByTag('name', categoryEvent)
      if (!actionEvent) {
        actionName = 'for all actions'
      }
      if (!categoryEvent) {
        categoryName = 'in all categories'
      }
      let newName = actionName + ', in the category of: ' + categoryName
      if (!categoryEvent) {
        newName = actionName + ', ' + categoryName
      }
      setName(newName)
      const oEvent = await makeWord(
        oProfile,
        oActions,
        oCategories,
        newName,
        description,
        selectedAction,
        selectedCategory,
        makeEditable,
      )
      setOEvent(oEvent)
      return newName
    },
    [name, description, selectedAction, selectedCategory, makeEditable],
  )
  const updateSelectedAction = useCallback(
    async (newSelectedAction) => {
      setSelectedAction(newSelectedAction)
      newName = await autoCompleteName(newSelectedAction, selectedCategory)
      const oEvent = await makeWord(
        oProfile,
        oActions,
        oCategories,
        newName,
        description,
        newSelectedAction,
        selectedCategory,
        makeEditable,
      )
      setOEvent(oEvent)
    },
    [name, description, selectedAction, selectedCategory, makeEditable],
  )
  const updateSelectedCategory = useCallback(
    async (newSelectedCategory) => {
      setSelectedCategory(newSelectedCategory)
      newName = await autoCompleteName(selectedAction, newSelectedCategory)
      const oEvent = await makeWord(
        oProfile,
        oActions,
        oCategories,
        newName,
        description,
        selectedAction,
        newSelectedCategory,
        makeEditable,
      )
      setOEvent(oEvent)
    },
    [name, description, selectedAction, selectedCategory, makeEditable],
  )
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Make New Context</strong>
            </CCardHeader>
            <CCardBody>
              <CForm>
                <ActionSelector updateSelectedAction={updateSelectedAction} />
                <CategorySelector updateSelectedCategory={updateSelectedCategory} />
                <CFormInput
                  type="text"
                  id="name"
                  label="name"
                  placeholder="to curate nostr content"
                  required
                  value={name}
                  onChange={handleNameChange}
                />
                <br /><br />
                <CFormTextarea
                  type="text"
                  id="description"
                  rows={3}
                  label="description"
                  placeholder="lorem ipsum"
                  value={description}
                  onChange={handleDescriptionChange}
                />
                <br />
                <div>
                  <div style={{ display: 'inline-block' }}>
                    <CFormSwitch
                      onChange={(e) => toggleMakeEditable(e)}
                      label="make editable?"
                      active
                      checked={makeEditable}
                    />
                  </div>{' '}
                  <strong>{makeEditableState}</strong>
                </div>
              </CForm>
              <CButton
                color="primary"
                className={submitEventButtonClassName}
                id="submitEventButton"
                active
                tabIndex={-1}
                onClick={publishNewEvent}
              >
                Submit
              </CButton>
              <div className={createAnotherElementClassName}>
                <br />
                <CCardTitle>Your context has been published!</CCardTitle>
                <CButton
                  color="primary"
                  id="createAnotherEventButton"
                  onClick={createAnotherContextButton}
                >
                  Create another context
                </CButton>
              </div>
            </CCardBody>
          </CCard>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'inline-block' }}>
              <CFormSwitch
                onChange={(e) => toggleShowRawData(e)}
                label="raw JSON"
                id="formSwitchCheckDefault"
              />
            </div>
          </div>
          <RawData showRawDataButton={showRawDataButton} oEvent={oEvent} />
        </CCol>
      </CRow>
    </>
  )
}

export default MakeNewContext
