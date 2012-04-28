var startTag = /^<([^\s=\/>]+)((?:\s+[^\s=\/>]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+)?)?)*)\s*(\/?)\s*>/
  , endTag = /^<\/([^\s=\/>]+)[^>]*>/
  , attr = /([^\s=]+)(?:\s*(=)\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+))?)?/g
  , comment = /^<!--([\s\S]*?)-->/
  , rawTagsDefault = /^(style|script)$/i

function empty() {}

function matchingEndTag(tagName) {
  new RegExp('</' + tagName, 'i')
}

module.exports = function(html, options) {
  if (options == null) options = {}

  var startHandler = options.start || empty
    , textHandler = options.text || empty
    , endHandler = options.end || empty
    , commentHandler = options.comment || empty
    , rawTags = options.rawTags || rawTagsDefault
    , index, isText, last, match, pos, tagName

  function parseStartTag(tag, tagName, rest) {
    var attrs = {}
    rest.replace(attr, function(match, name, equals, attr0, attr1, attr2) {
      attrs[name.toLowerCase()] = attr0 || attr1 || attr2 || (equals ? '' : null)
    })
    startHandler(tag, tagName.toLowerCase(), attrs, html)
  }

  function parseEndTag(tag, tagName) {
    endHandler(tag, tagName.toLowerCase(), html)
  }

  function parseComment(tag, data) {
    commentHandler(tag, data, html)
  }

  function parseText(index, isRawText) {
    var text
    if (~index) {
      text = html.slice(0, index)
      html = html.slice(index)
    } else {
      text = html
      html = ''
    }
    if (text) textHandler(text, isRawText, html)

    return html
  }


  while (html) {
    last = html
    isText = true

    if (html[0] === '<') {
      if (html[1] === '/') {
        if (match = html.match(endTag)) {
          pos = match[0].length
          html = html.slice(pos)
          match[0].replace(endTag, parseEndTag)
          isText = false
        } else {
          throw new Error('Invalid end tag: ' html)
        }

      } else if (html[1] === '!') {
        if (match = html.match(comment)) {
          pos = match[0].length
          html = html.slice(pos)
          match[0].replace(comment, parseComment)
          isText = false
        } else {
          throw new Error('Invalid comment: ' + html)
        }
      }

      } else {
        if (match = html.match(startTag)) {
          pos = match[0].length
          html = html.slice(pos)
          match[0].replace(startTag, parseStartTag)
          isText = false
          tagName = match[1]

          if (rawTags.test(tagName)) {
            index = html.search(matchingEndTag(tagName))
            parseText(index, true)
          }
        }
      }
    }

    if (isText) {
      index = html.indexOf('<')
      parseText(index)
    }

    if (html === last) throw new Error('Unknown HTML parse error: ' + html)
  }
}
