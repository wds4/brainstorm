export function fetchFirstByTag(tag, event) {
  try {
    const aResult = event.tags.filter(([k, v]) => k === tag && v && v !== '')
    if (aResult.length > 0) {
      const result = aResult[0][1]
      return result
    }
    return ''
  } catch (e) {
    console.log(e)
  }
  return ''
}

// this imports an event which may or may not be serializable and returns a serializable event
export const makeEventSerializable = (oEventIn) => {
  const oEventOut = {}
  oEventOut.id = oEventIn.id
  oEventOut.kind = oEventIn.kind
  oEventOut.content = oEventIn.content
  oEventOut.tags = oEventIn.tags
  oEventOut.created_at = oEventIn.created_at
  oEventOut.pubkey = oEventIn.pubkey
  oEventOut.sig = oEventIn.sig
  return oEventOut
}

export const secsToTime = (secs) => {
  let displayTime = '--'
  const currentTime = Math.floor(Date.now() / 1000)
  const ageSecs = currentTime - secs
  const ageMins = Math.floor(ageSecs / 60)
  const ageHours = Math.floor(ageSecs / (60 * 60))
  const ageDays = Math.floor(ageSecs / (60 * 60 * 24))
  const ageYears = Math.floor(ageSecs / (60 * 60 * 24 * 365))
  let discoveredUnit = false
  if (!discoveredUnit && ageSecs < 60) {
    // if less than one minute,
    // display in seconds
    displayTime = `${ageSecs} s`
    discoveredUnit = true
  }
  if (!discoveredUnit && ageSecs < 60 * 60) {
    // if less than one hour,
    // display in minutes
    displayTime = `${ageMins} m`
    discoveredUnit = true
  }
  if (!discoveredUnit && ageSecs < 24 * 60 * 60) {
    // if less than one day,
    // display in hours
    displayTime = `${ageHours} h`
    discoveredUnit = true
  }
  if (!discoveredUnit && ageSecs < 365 * 24 * 60 * 60) {
    // if less than one year,
    // display in days
    displayTime = `${ageDays} d`
    discoveredUnit = true
  }
  if (!discoveredUnit) {
    // else display in years
    displayTime = `${ageYears} y`
    discoveredUnit = true
  }

  return displayTime
}

export const secsToTimeAgo = (secs) => {
  let displayTime = '--'
  const currentTime = Math.floor(Date.now() / 1000)
  const ageSecs = currentTime - secs
  const ageMins = Math.floor(ageSecs / 60)
  const ageHours = Math.floor(ageSecs / (60 * 60))
  const ageDays = Math.floor(ageSecs / (60 * 60 * 24))
  const ageYears = Math.floor(ageSecs / (60 * 60 * 24 * 365))
  let discoveredUnit = false
  if (!discoveredUnit && ageSecs < 60) {
    // if less than one minute,
    // display in seconds
    displayTime = `${ageSecs} seconds`
    if (ageSecs == 1) {
      displayTime = `${ageSecs} second`
    }
    discoveredUnit = true
  }
  if (!discoveredUnit && ageSecs < 60 * 60) {
    // if less than one hour,
    // display in minutes
    displayTime = `${ageMins} minutes`
    if (ageMins == 1) {
      displayTime = `${ageMins} minute`
    }
    discoveredUnit = true
  }
  if (!discoveredUnit && ageSecs < 24 * 60 * 60) {
    // if less than one day,
    // display in hours
    displayTime = `${ageHours} hours`
    if (ageHours == 1) {
      displayTime = `${ageHours} hour`
    }
    discoveredUnit = true
  }
  if (!discoveredUnit && ageSecs < 365 * 24 * 60 * 60) {
    // if less than one year,
    // display in days
    displayTime = `${ageDays} days`
    if (ageDays == 1) {
      displayTime = `${ageDays} day`
    }
    discoveredUnit = true
  }
  if (!discoveredUnit) {
    // else display in years
    displayTime = `${ageYears} years`
    if (ageYears == 1) {
      displayTime = `${ageYears} year`
    }
    discoveredUnit = true
  }
  displayTime += ' ago'

  return displayTime
}

export const removeDuplicatesFromArrayOfStrings = (aIn) => {
  const aOut = []
  aIn.forEach((element) => {
    if (!aOut.includes(element)) {
      aOut.push(element)
    }
  })
  return aOut
}

export const convertNameToSlug = (name) => {
  var slug = name
  if (name) {
    var slug = ''
    var aChunks = name.split(' ')
    for (var c = 0; c < aChunks.length; c++) {
      var nextChunk = aChunks[c]
      if (nextChunk) {
        if (c > 0) {
          nextChunk = nextChunk[0].toUpperCase() + nextChunk.substring(1)
        }
        slug += nextChunk
      }
    }
  }
  return slug
}

export const convertNameToTitle = (name) => {
  var title = name
  if (name) {
    var title = ''
    var aChunks = name.split(' ')
    for (var c = 0; c < aChunks.length; c++) {
      var nextChunk = aChunks[c]
      if (nextChunk) {
        nextChunk = nextChunk[0].toUpperCase() + nextChunk.substring(1)
        title += nextChunk
        if (c < aChunks.length - 1) {
          title += ' '
        }
      }
    }
  }
  return title
}

export const timeout = async (ms) => {
  console.log('timeout')
  return new Promise((resolve) => setTimeout(resolve, ms))
}
