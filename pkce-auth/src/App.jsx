import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { getTokenFromUrl, loginUrl, logout, updateLocalStorage } from './spotify';
import Login from './components/Login';
import Home from './components/Home';

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    console.log(location)
    const hash = getTokenFromUrl();
    window.location.hash = '';
    const _token = hash.access_token;

    console.log(_token)
    debugger

    if (_token) {
      setToken(_token);
      updateLocalStorage(_token, hash.expires_in);
    }

    const storedToken = window.localStorage.getItem('spotify_access_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.get(loginUrl);
      console.log(response)
      debugger
      const { url, state, codeVerifier } = response.data;
      localStorage.setItem('pkce_state', state);
      localStorage.setItem('pkce_code_verifier', codeVerifier);
      console.log(state, codeVerifier)
      debugger
      window.location = url;
      console.log(url)
      debugger
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="app">
      {!token ? (
        <Login handleLogin={handleLogin} />
      ) : (
        <Profile logout={logout} />
      )}
    </div>
  );
}
