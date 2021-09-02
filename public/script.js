let username = prompt("Username: ");
if (username.length == 0) username = "Anonymous"

let socket = io();
let user;
let users = Array();
let focused_user;

function getUser(user_id)
{
    for (const user of users)
    {
        if (user.id === user_id) return user;
    }

    return null;
}


$('#button-addon2').click(() => {
    let content = $('#input').val();
    $('#input').val('');
    if (content.length == 0 || !focused_user) return;
    


    message = {
        "sender": user,
        "receiver": focused_user,
        "content": content, 
        "date": new Date().toLocaleTimeString()
    }
    socket.emit('message', message);
    addSentMessage(message);
});

function removeFocusOnUser()
{
    let box = $('.messages-box-list').find(".active");
    box.removeClass('active');
    box.removeClass('text-white');
    box.addClass('list-group-item-light');
}

function setFocusOnUser(user_id)
{
    focused_user = getUser(user_id);
    let box = $('.messages-box-list').find("#" + user_id);
    box.removeClass('list-group-item-light');
    box.addClass('text-white');
    box.addClass('active');
}

function onMessageBoxClick(user_id)
{
    removeFocusOnUser();
    setFocusOnUser(user_id);
    setChat(user_id);

}

function scrollToBottom(el)
{
    el.scrollTop = el.scrollHeight;
}

$('#messages-box-template').click((event) => {
    let maxIterations = 5;

    let el = $(event.target);
    let parent = el.parent();
    while (!parent.hasClass("msg-box") && maxIterations > 0)
    {
        el = parent;
        parent = el.parent();
        maxIterations--;
    }
    let user_id = parent.attr("id");
    onMessageBoxClick(user_id);
})

function removeCurrentChat()
{
    let old = $('.chat-boxes').find('.current-box');
    old.removeClass('current-box');
    old.addClass('d-none');
}

function disableBlankChat()
{
    if (!$('#blank-chat-box').hasClass('d-none'))
    {
        $('#blank-chat-box').addClass('d-none');
    }
}

function setBlankChat()
{
    removeCurrentChat();
    $('#blank-chat-box').removeClass("d-none");
}


function setChat(user_id)
{
    disableBlankChat();
    removeCurrentChat();
    let new_box = $('.chat-boxes').find("#" + user_id);
    let msg_box = $('.messages-box-list').find("#" + user_id);
    new_box.removeClass('d-none');
    new_box.addClass('current-box');

    // scroll to bottom
    scrollToBottom(new_box);

    // remove higlighting (if exists)
    msg_box.find('.messages-box-username').removeClass('font-weight-bold');
    msg_box.find('.messages-box-username').removeClass('text-primary');
}


function createChat(user_id)
{
    let chat_box = $('.chat-boxes');
    let chat = $('.chat-box-template').clone(true);
    chat.removeClass('chat-box-template');
    chat.attr("id", user_id);
    chat_box.append(chat);

}

function removeChat(user_id)
{
    let chat = $('.chat-boxes').find("#" + user_id);
    chat.remove();
}

function addRecievedMessage(message)
{   // adding message to box
    let chat = $('.chat-boxes').find("#" + message.sender.id);
    let msg = $('.sender-template').clone();
    msg.removeClass('sender-template');
    msg.find('.msg-user-photo').attr("src", message.sender.photo);
    msg.find('.msg-content').text(message.content);
    msg.find('.msg-date').text(message.date);
    chat.append(msg);

    // highlighting message-box
    let msg_box = $('.messages-box-list').find("#" + message.sender.id).find('.messages-box-username');
    if (!msg_box.hasClass('font-weight-bold') && !chat.hasClass('current-box'));
    {
        msg_box.addClass('text-primary');
        msg_box.addClass('font-weight-bold');
    }

    // scroll to bottom
    scrollToBottom(chat);
}

function addSentMessage(message)
{
    let chat = $('.chat-boxes').find("#" + message.receiver.id);
    let msg = $('.receiver-template').clone();
    msg.removeClass('receiver-template');
    msg.find('.msg-content').text(message.content);
    msg.find('.msg-date').text(message.date);
    chat.append(msg);

    // scroll to bottom
    scrollToBottom(chat);
}

function createMessageBox(user)
{
    let el = $('#messages-box-template').clone(true);
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



function onNewUser(user)
{
    users.push(user);
    createChat(user.id);
    createMessageBox(user);
}

function onDeleteUser(user_id)
{
    $('.messages-box-list').find("#" + user_id).remove();
    removeChat(user_id);
    if (focused_user && focused_user.id == user_id)
    {
        setBlankChat();
        focused_user = null;

    }
}


socket.on('init', function(u, user_obj) {
    user = {
        "id": socket.id,
        "username": username,
        "joined": user_obj.joined,
        "photo": user_obj.photo
    }
    socket.emit("setDetails", username, socket.id, );
    $('#username').html("Hello <strong>" + username + "</strong>!");

    for (const user of u) onNewUser(user);

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


