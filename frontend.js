const path = require('path')
const proxy = require('express-http-proxy');
const express = require('express');
const PORT = process.env.PORT || 1234

const app = express();

console.log('server starting up')

app.use(
  "/graphql",
  proxy(
    "127.0.0.1:4321",
  )
);

app.use(express.static(path.join(__dirname, 'dist')));

app.listen(PORT, () => console.log(`Listening at: http://0.0.0.0:${PORT}`));
