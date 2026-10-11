// The login token is kept in localStorage. Simple, but readable by any script on the page (XSS),
// so keep dependencies minimal and never render untrusted HTML. For stricter setups, switch to an httpOnly cookie.
const KEY = 'expense-token';
export const getToken = () => (typeof window === 'undefined' ? null : localStorage.getItem(KEY));
export const setToken = (t) => localStorage.setItem(KEY, t);
export const clearToken = () => localStorage.removeItem(KEY);
