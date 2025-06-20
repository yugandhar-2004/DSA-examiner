// server.js

const express = require('express');
const app = express();
const judgeProxy = require('./backend/judge0-proxy');
const path = require('path');

app.use(express.static('public')); // Your frontend (HTML, CSS, JS)
app.use(express.json());
app.use('/', judgeProxy); // Route all `/run` POST requests

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
