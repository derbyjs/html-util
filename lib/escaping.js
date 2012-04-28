var entityCode = require('./entityCode')

exports.escapeHtml = function(value) {
  if (value == null) return ''

  return value
    .toString()
    .replace(/&(?!\s)|</g, function(match) {
      return match === '&' ? '&amp;' : '&lt;'
    })
}

exports.escapeAttribute = function(value) {
  if (value == null || value === '') return '""'

  value = value
    .toString()
    .replace(/&(?!\s)|"/g, function(match) {
      return match === '&' ? '&amp;' : '&quot;'
    })
  return /[ =<>']/.test(value) ? '"' + value + '"' : value
}


// Based on:
// http://code.google.com/p/jslibs/wiki/JavascriptTips#Escape_and_unescape_HTML_entities

exports.unescapeEntities = function(html) {
  return html.replace(/&([^;]+);/g, function(match, entity) {
    var charCode = entity.charAt(0) === '#'
          ? entity.charAt(1) === 'x'
            ? entity.slice(2, 17)
            : entity.slice(1)
          : entityCode[entity]
    return String.fromCharCode(charCode)
  })
}
