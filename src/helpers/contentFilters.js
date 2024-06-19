const processWikiMarkdownLink = (contentIn_, aTopicSlugs) => {
  // TO DO: may use aTopicSlugs to style link based on whether topic currently exists or not
  let contentIn = contentIn_
  if (!contentIn) {
    contentIn = ''
  }
  const baseUrl = window.location.origin
  let contentOut = ''
  const bracketsStart = contentIn.indexOf('[[')
  const bracketsEnd = contentIn.indexOf(']]')
  if (bracketsStart > -1 && bracketsEnd > bracketsStart) {
    const str0 = contentIn.substr(0, bracketsStart)
    const str1excise = contentIn.substr(bracketsStart, bracketsEnd - bracketsStart + 2)
    const str1topicOriginal = contentIn.substr(bracketsStart + 2, bracketsEnd - bracketsStart - 2)
    const str1topicSlugified = str1topicOriginal.replaceAll(' ', '-').toLowerCase()
    const str2 = contentIn.substr(bracketsEnd + 2)
    let strLink =
      '[' +
      str1topicOriginal +
      '](' +
      baseUrl +
      '/#/nostrapedia/topic?topic=' +
      str1topicSlugified +
      ')'
    contentOut = str0 + strLink + str2
  } else {
    contentOut = contentIn
  }
  return contentOut
}

export const processWikiMarkdownLinks = (contentIn, aTopicSlugs) => {
  let contentOut = contentIn
  let contentProcessed = ''
  let contentTemp = contentIn
  do {
    contentTemp = contentOut
    contentProcessed = processWikiMarkdownLink(contentTemp, aTopicSlugs)
    contentOut = contentProcessed
  } while (contentProcessed != contentTemp)
  return contentOut
}
