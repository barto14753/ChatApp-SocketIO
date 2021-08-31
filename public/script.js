let username = prompt("Username: ");
let socket = io();
let user;
let users;
let focused_user;


$('#button-addon2').click(() => {
    let content = $('#input').val();
    if (content.length == 0) return;
    $('#input').val('');

    message = {
        "sender": user,
        "reciever": focused_user,
        "content": content, 
        "date": new Date().toLocaleTimeString()
    }

    socket.emit('message', message);
    addSentMessage(message);
});

$('.msg-box').click(() => {alert("POP")});

function onUserClick(event)
{
    alert("CLICK");
}


function setBlankChat()
{
    $('#blank-chat-box').removeClass("d-none");
}


function createChat(user_id)
{
    let chat_box = $('.chat-boxes');
    let chat = $('.chat-box-template').clone(true);
    chat.attr("id", user_id);
    chat_box.append(chat);
    
    
}

function removeChat(user_id)
{
    let chat = $('.chat-box').find("#" + user_id.toString());
    if (!chat.hasClass('d-none'))
    {
        setBlankChat();
    }
    chat.remove();
}

function addRecievedMessage(message)
{
    let chat = $('.chat-box').find("#" + message.sender.id.toString());
    let msg = $('.sender-template').clone();
    msg.find('.msg-user-photo').attr("src", message.user.photo);
    msg.find('.msg-content').text(message.content);
    msg.find('.msg-date').text(message.date);
    chat.append(msg);
}

function addSentMessage(message)
{
    let chat = $('.chat-box').find("#" + message.reciever.id.toString());
    let msg = $('.reciever-template').clone();
    msg.find('.msg-content').text(message.content);
    msg.find('.msg-date').text(message.date);
    chat.append(msg);
}



function onNewUser(user)
{
    createChat(user.id);

    let el = $('#messages-box-template').clone();
    el.attr("id", user.id);
    el.removeClass('d-none');
    
    let img = el.find(".messages-box-user-photo");
    img.attr("src", user.photo);

    let box_username = el.find(".messages-box-username");
    box_username.text(user.username);

    let date = el.find(".message-box-date");
    date.text(user.joined);

    let messages_box = $('.messages-box-list')
    messages_box.append(el);

    
}

function onDeleteUser(user_id)
{
    $('.messages-box-list').find("#" + user_id.toString()).remove();
}


socket.on('init', function(u, photo) {
    user = {
        "id": socket.id,
        "username": username,
        "photo": photo
    }
    users = u;
    socket.emit("setDetails", username, socket.id, );
    $('#username').html("Hello <strong>" + username + "</strong>!");

    for (const user of users) onNewUser(user);

  });

  socket.on('newUser', function(user) {
    onNewUser(user);
  });

  socket.on('deleteUser', function(user) {
    onDeleteUser(user.id);
  });

  socket.on('message', function(message) {
    addRecievedMessage(message);
  });


