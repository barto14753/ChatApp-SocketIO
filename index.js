const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
users = Array();

function getIndex(id)
{
  for (let i=0; i<users.length; i++)
  {
    if (users[i].id == id)
    {
      return i;
    }
  }
  return -1;
}

function generateID()
{
  for (let i=1; i<= users.length + 1; i++)
  {
    let found = true;
    for (const user of users)
    {
      if (user.id == i)
      {
        found = false;
        break;
      }
    }
    if (found) return i;
  }
  
  return -1;
}

function deleteUser(id)
{
  let index = getIndex(id);

    if (index > -1) {
      users.splice(index, 1);
    }
    console.log(users);
}

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

  let id = generateID();
  let username;


  users.push({
    "id": id,
    "username": ""
  });

  console.log('User nr %d connected', id); 
  socket.emit('init', id, users);
  console.log(users);


  socket.on('disconnect', () => {
    deleteUser(id);
    console.log("User nr %d disconnected", id);

  });

  socket.on('setUsername', (u) => {
    username = u;
    users[getIndex(id)].username = username;

    for (const user in users)
    {
      if (user.id == id)
      {
        user.username = username;
      }
    }
    console.log("User nr %d set username: %s", id, username);
    console.log(users);
    

  });
});




server.listen(3000, () => {
  console.log('Listening on port 3000');
});
