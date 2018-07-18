import { reloadAuthorized } from './Authorized';
// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return sessionStorage.getItem('electric-authority') || 'user';
}

export function setAuthority(authority) {
  const result = sessionStorage.setItem('electric-authority', authority);
  reloadAuthorized();
  return result;
}
