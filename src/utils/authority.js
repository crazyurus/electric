import { reloadAuthorized } from './Authorized';
// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return localStorage.getItem('electric-authority') || 'guest';
}

export function setAuthority(authority) {
  const result = localStorage.setItem('electric-authority', authority);
  reloadAuthorized();
  return result;
}
