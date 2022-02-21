var proxy = require('express-http-proxy');
const express = require('express');

const app = express();

console.log('server starting up')

app.use(
  "/graphql",
  proxy(
     "127.0.0.1:5000",
  )
);

app.use(express.static('dist'));

app.listen(1234);
