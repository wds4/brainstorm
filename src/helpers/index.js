export function fetchFirstByTag(tag, event) {
  let result = ''
  try {
    result = event.tags.filter(([k, v]) => k === tag && v && v !== '')[0][1]
    return result
  } catch (e) {
    console.log(e)
  }
  return result
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
    discoveredUnit = true
  }
  if (!discoveredUnit && ageSecs < 60 * 60) {
    // if less than one hour,
    // display in minutes
    displayTime = `${ageMins} minutes`
    discoveredUnit = true
  }
  if (!discoveredUnit && ageSecs < 24 * 60 * 60) {
    // if less than one day,
    // display in hours
    displayTime = `${ageHours} hours`
    discoveredUnit = true
  }
  if (!discoveredUnit && ageSecs < 365 * 24 * 60 * 60) {
    // if less than one year,
    // display in days
    displayTime = `${ageDays} days`
    discoveredUnit = true
  }
  if (!discoveredUnit) {
    // else display in years
    displayTime = `${ageYears} years`
    discoveredUnit = true
  }
  displayTime += ' ago'

  return displayTime
}