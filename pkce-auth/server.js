const express = require('express');
const cors = require('cors');
const axios = require('axios');
const querystring = require('querystring');
const crypto = require('crypto');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const clientId = 'CLIENT_ID';
const clientSecret = 'CLIENT_SECRET';

const redirectUri = 'http://localhost:3000/callback';

const corsOptions = {
  origin: ['http://localhost:5000', 'http://localhost:5000/login', 'http://localhost:8000', 'http://localhost:8000/login', 'http://localhost:8000/refresh_token', 'https://accounts.spotify.com', 
   'http://localhost:3000', 'http://localhost:3000/callback'
  ],
  methods: 'GET,POST,PUT',
  allowedHeaders: 'Content-Type,Authorization,Access-Control-Allow-Origin',
};

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Implement middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.use(bodyParser.json());
app.use(cors(corsOptions));



app.get('/login', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  const codeVerifier = crypto.randomBytes(32).toString('hex');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const scope = 'user-read-private user-read-email user-read-recently-played user-read-playback-state user-top-read';

  const queryParams = querystring.stringify({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state: state,
    scope: scope,
  });

  res.json({
    url: `https://accounts.spotify.com/authorize?${queryParams}`,
    state: state,
    codeVerifier: codeVerifier,
  });
});

app.post('/callback', async (req, res) => {
  const { code, state, codeVerifier, storedState } = req.body;

  if (state !== storedState) {
    return res.status(400).json({ error: 'State mismatch' });
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
      }
    );
    console.log(response)
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: 'Failed to get token' });
  }
});


app.post('/refresh_token', async (req, res) => {
  const { refresh_token } = req.body;

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: 'Failed to refresh token' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});