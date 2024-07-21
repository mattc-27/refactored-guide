import axios from 'axios';

const LOCALSTORAGE_KEYS = {
  accessToken: 'spotify_access_token',
  refreshToken: 'spotify_refresh_token',
  expireTime: 'spotify_token_expire_time',
  timestamp: 'spotify_token_timestamp',
};

const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
};

export const loginUrl = 'http://localhost:8000/login';

export const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial, item) => {
      let parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
};

export const logout = () => {
  for (const property in LOCALSTORAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
  }
  window.location = window.location.origin;
};

const refreshToken = async () => {
  try {
    const { data } = await axios.post('http://localhost:8000/refresh_token', {
      refresh_token: LOCALSTORAGE_VALUES.refreshToken,
    });
    const { access_token, expires_in } = data;
    updateLocalStorage(access_token, expires_in);
    window.location.reload();
    return;
  } catch (e) {
    console.error(e);
    logout();
  }
};

const hasTokenExpired = () => {
  const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
  if (!accessToken || !timestamp) {
    return false;
  }
  const millisecondsElapsed = Date.now() - Number(timestamp);
  return (millisecondsElapsed / 1000) > Number(expireTime);
};

export const getAccessToken = () => {
  const { accessToken, timestamp, expireTime, refreshToken } = LOCALSTORAGE_VALUES;

  if (!accessToken || hasTokenExpired()) {
    refreshToken();
  }

  return accessToken;
};

export const updateLocalStorage = (token, expires_in) => {
  window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, token);
  window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
  window.localStorage.setItem(LOCALSTORAGE_KEYS.expireTime, expires_in);
};

export const getSpotifyData = async (endpoint) => {
  const accessToken = getAccessToken();
  const { data } = await axios.get(`https://api.spotify.com/v1/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
};