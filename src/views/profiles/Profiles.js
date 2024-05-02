import { CForm, CFormInput } from '@coreui/react'
import React, { useCallback, useState } from 'react'

const Profiles = () => {
  const [npub, setNpub] = useState('')
  const handleRateeNpubChange = useCallback(
    async (e) => {
      const newNpub = e.target.value
      setNpub(newNpub)
    },
    [npub],
  )
  return (
    <>
      <center>
        <h3>Profiles</h3>
      </center>
      <CForm>
        <CFormInput
          type="text"
          placeholder="npub ..."
          value={npub}
          onChange={handleRateeNpubChange}
        />
      </CForm>
      <div>npub: {npub}</div>
    </>
  )
}

export default Profiles
