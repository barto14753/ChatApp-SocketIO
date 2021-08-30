const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

server.listen(3000, () => {
  console.log('Listening on port 3000');
});

app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/index.html');
});

