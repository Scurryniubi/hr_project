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

/**
 * @param {string} phone
 * @returns {Boolean}
 */
export function validMobile(phone) {
  return /^1[2|3|4|5|6|7|8][0-9]{9}$/.test(phone)
}
