const processWikiMarkdownLink = (contentIn) => {
  let contentOut = ''
  const bracketsStart = contentIn.indexOf('[[')
  const bracketsEnd = contentIn.indexOf(']]')
  if (bracketsStart > -1 && bracketsEnd > bracketsStart) {
    const str0 = contentIn.substr(0, bracketsStart)
    const str1excise = contentIn.substr(bracketsStart, bracketsEnd - bracketsStart + 2)
    const str1topicOriginal = contentIn.substr(bracketsStart + 2, bracketsEnd - bracketsStart - 2)
    const str1topicSlugified = str1topicOriginal.replace(' ', '-').toLowerCase()
    const str2 = contentIn.substr(bracketsEnd + 2)
    const strLink =
      '[' +
      str1topicOriginal +
      '](http://localhost:3000/#/wikifreedia/singleTopic?topic=' +
      str1topicSlugified +
      ')'

    contentOut = str0 + strLink + str2
  } else {
    contentOut = contentIn
  }
  return contentOut
}

export const processWikiMarkdownLinks = (contentIn) => {
  let contentOut = contentIn
  let contentProcessed = ''
  let contentTemp = contentIn
  do {
    contentTemp = contentOut
    contentProcessed = processWikiMarkdownLink(contentTemp)
    contentOut = contentProcessed
  } while (contentProcessed != contentTemp)
  return contentOut
}
