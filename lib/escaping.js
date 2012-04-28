var entityCode = require('./entityCode')

exports.escapeHtml = function(s) {
  if (s == null) {
    return ''
  } else {
    return s.toString().replace(/&(?!\s)|</g, function(s) {
      if (s === '&') {
        return '&amp;'
      } else {
        return '&lt;'
      }
    })
  }
}

exports.escapeAttribute = function(s) {
  if (s == null || s === '') {
    return '""'
  }
  s = s.toString().replace(/&(?!\s)|"/g, function(s) {
    if (s === '&') {
      return '&amp;'
    } else {
      return '&quot;'
    }
  });
  if (/[ =<>']/.test(s)) {
    return '"' + s + '"'
  } else {
    return s
  }
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
