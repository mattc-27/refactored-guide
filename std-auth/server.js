// Setup express
const express = require('express');

// Import middleware
const path = require('path');
//const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:5000',
  methods: 'GET,POST,PUT',
  allowedHeaders: 'Content-Type,Authorization',
};

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Create express app
const app = express();


// Implement middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.use(bodyParser.json());
app.use(cors(corsOptions));
//app.use(cookieParser());


app.get(`/api/backend_test/`, async (req, res) => {
    try {
      // Your code to handle the request
      res.status(200).json({ Express: 'Back end is connected' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


// Setup default port
app.set('port', process.env.PORT || 8080);

// Start express app
app.listen(app.get('port'), () => {
  console.log(`Server running at port: ${app.get('port')}`)
});