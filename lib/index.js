exports.parse = require('./parse')

var escaping = require('./escaping')
for (var prop of escaping) {
  exports[prop] = escaping[prop]
}

var voidElement = {
  area: 1
, base: 1
, br: 1
, col: 1
, command: 1
, embed: 1
, hr: 1
, img: 1
, input: 1
, keygen: 1
, link: 1
, meta: 1
, param: 1
, source: 1
, track: 1
, wbr: 1
}
exports.isVoid = function(name) {
  return name in voidElement
}
