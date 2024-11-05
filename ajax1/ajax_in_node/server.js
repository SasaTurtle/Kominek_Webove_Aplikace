const express = require('express');
const corsMiddleware = require('./cors');
const requests = require('./request');

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use('/cmd', requests);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
