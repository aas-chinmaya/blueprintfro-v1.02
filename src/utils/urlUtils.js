// src/utils/urlMask.js
// Frontend-only: token mapping + base64 fallback utilities.
// Token persists in localStorage until removed (or cleared by the hook).

const STORAGE_PREFIX = "maskmap:v1:"; // localStorage key prefix

function isClient() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/**
 * Generate a random token (UUID if available, fallback to random string)
 */
export function generateToken(len = 36) {
  if (!isClient()) return null;
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // fallback
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < (len || 36); i++) out += possible.charAt(Math.floor(Math.random() * possible.length));
  return out;
}

/* ---------- token map helpers ---------- */

/**
 * Store mapping token -> id in localStorage
 */
export function storeTokenMapping(token, id) {
  if (!isClient() || !token || !id) return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + token, id);
  } catch (e) {
    // ignore storage errors
  }
}

/**
 * Return id for token, or null
 */
export function getIdForToken(token) {
  if (!isClient() || !token) return null;
  try {
    return window.localStorage.getItem(STORAGE_PREFIX + token);
  } catch (e) {
    return null;
  }
}

/**
 * Find existing token for a given id (so we reuse token if already created)
 */
export function findTokenById(id) {
  if (!isClient() || !id) return null;
  try {
    const st = window.localStorage;
    for (let i = 0; i < st.length; i++) {
      const key = st.key(i);
      if (!key || !key.startsWith(STORAGE_PREFIX)) continue;
      const val = st.getItem(key);
      if (val === id) {
        return key.slice(STORAGE_PREFIX.length);
      }
    }
  } catch (e) {}
  return null;
}

/**
 * Remove a single token mapping
 */
export function removeToken(token) {
  if (!isClient() || !token) return;
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + token);
  } catch (e) {}
}

/**
 * Remove mapping by id (delete the token that maps to this id)
 */
export function removeTokenForId(id) {
  if (!isClient() || !id) return;
  const token = findTokenById(id);
  if (token) removeToken(token);
}

/* ---------- base64URL helpers (fallback/compat) ---------- */

export function encodeBase64Url(str) {
  if (!isClient() || typeof str !== "string") return str;
  try {
    const b = btoa(unescape(encodeURIComponent(str))); // utf-8 safe
    return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch (e) {
    return str;
  }
}

export function decodeBase64Url(b64url) {
  if (!isClient() || !b64url) return null;
  try {
    const b = b64url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b.length % 4 === 0 ? "" : "=".repeat(4 - (b.length % 4));
    const raw = atob(b + pad);
    return decodeURIComponent(escape(raw));
  } catch (e) {
    return null;
  }
}

/* ---------- higher-level helpers ---------- */

/**
 * Get existing token for id or create and store a new one.
 * Returns token string (or null if not available)
 */
export function getOrCreateTokenForId(id) {
  if (!isClient() || !id) return null;
  // reuse if exists
  const existing = findTokenById(id);
  if (existing) return existing;
  const token = generateToken();
  storeTokenMapping(token, id);
  return token;
}

/**
 * Mask an id for URL using strategy 'token' (localStorage mapping) or fallback 'base64'.
 * strategy: 'token' | 'base64'
 * Returns masked string to use in URL.
 */
export function maskIdForUrl(id, strategy = "token") {
  if (!isClient() || !id) return id;
  if (strategy === "base64") {
    return encodeBase64Url(id);
  }
  // default token behavior
  return getOrCreateTokenForId(id);
}

/**
 * Resolve a masked value back to original id:
 *  - try token lookup
 *  - then try base64 decode
 *  - then return input as fallback
 */
export function resolveMaskedValue(masked) {
  if (!isClient() || !masked) return null;
  // try token first
  const tokenLookup = getIdForToken(masked);
  if (tokenLookup) return tokenLookup;
  // try base64
  const decoded = decodeBase64Url(masked);
  if (decoded) return decoded;
  // fallback
  return masked;
}

/**
 * Clear all maskmap items (use with care)
 */
export function clearAllMappings() {
  if (!isClient()) return;
  try {
    const st = window.localStorage;
    const keys = [];
    for (let i = 0; i < st.length; i++) {
      const key = st.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) keys.push(key);
    }
    keys.forEach(k => st.removeItem(k));
  } catch (e) {}
}

export default {
  generateToken,
  storeTokenMapping,
  getIdForToken,
  findTokenById,
  removeToken,
  removeTokenForId,
  maskIdForUrl,
  resolveMaskedValue,
  encodeBase64Url,
  decodeBase64Url,
  clearAllMappings,
};
