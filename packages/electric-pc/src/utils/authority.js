import { reloadAuthorized } from './Authorized';

const key = 'electric-authority';

export function getAuthority() {
  return sessionStorage.getItem(key) || 'user';
}

export function setAuthority(authority) {
  const result = sessionStorage.setItem(key, authority);
  reloadAuthorized();
  return result;
}
