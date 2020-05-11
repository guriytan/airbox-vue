/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

let Base64 = require('js-base64').Base64

export function EncodeLink(link) {
  let time = new Date()
  time.setDate(time.getDate() + 1)
  return Base64.encode(link + ":" + time.toLocaleString())
}

export function DecodeLink(link) {
  let list = Base64.decode(link).split(":")
  if (list.length !== 2) {
    return ""
  }
  if (new Date() > new Date(list[1])) {
    return ""
  } else return list[0]
}
