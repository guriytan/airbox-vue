import Cookies from 'js-cookie'

const TokenKey = 'air_box_token';

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, {
    expires: new Date(new Date().getTime() + 6 * 60 * 60 * 1000)
  });
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
