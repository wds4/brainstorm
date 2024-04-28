export function fetchFirstByTag(tag, event) {
  let result = 'foo'
  try {
    result = event.tags.filter(([k, v]) => k === tag && v && v !== '')[0][1]
  } catch (e) {
    console.log(e)
  }
  return result
}
