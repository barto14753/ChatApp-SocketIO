let username = prompt("Username: ");
let socket = io();
let id;


function getUserImage(i)
{
    switch(i % 6)
    {
        case 0:
            return 'faces/face1.png';
        case 1:
            return 'faces/face2.png';
        case 2:
            return 'faces/face3.png';
        case 3:
            return 'faces/face4.png';
        case 4:
            return 'faces/face5.png';
        case 5:
            return 'faces/face6.png';
    }
}

socket.on('init', function(id, users) {
    id = id;
    socket.emit("setUsername", username);
    $('#username').text("You are " + username.toString() + " #" + id.toString());

  });
