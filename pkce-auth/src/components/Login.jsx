import React from 'react';

const Login = ({ handleLogin }) => (
  <div>
    <h1>Spotify PKCE Auth Example</h1>
    <button onClick={handleLogin}>Log in with Spotify</button>
  </div>
);

export default Login;
