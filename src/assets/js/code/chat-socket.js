import io from '../../../../node_modules/socket.io-client/dist/socket.io';

const ownerList = {};

if ($('#chat').length > 0) {
  $(document).ready(() => {
    $(() => {
      const socket = io();
      socket.on('connect', () => {
        const url = window.location.pathname;
        const owner = $('#currentUser').val();
        const id = url.substring(url.lastIndexOf('/') + 1);
        if (!ownerList[id]) {
          ownerList[id] = owner;
        }
        socket.emit('join chat', { chatId: id, owner }); // agregar el owner aca
      });
      $('#send-message').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        $.post(
          $(this).attr('action'), // The URL to send form data to
          $(this).serialize(),
          (data) => {
            const url = window.location.pathname;
            const id = url.substring(url.lastIndexOf('/') + 1);
            socket.emit('chat message', { chatId: id, msg: data });
            $('#m').val('');
          },
        );
        return false;
      });
      socket.on('chat message', (msg) => {
        if (msg.currentUserId === parseInt(ownerList[msg.chatId])) {
          $('#messages').append($('<span>').text(msg.time).addClass('time'));
          $('#messages').append($('<span>').text(msg.message).addClass('me'));
        } else {
          $('#messages').append($('<span>').text(msg.time).addClass('time-other'));
          $('#messages').append($('<span>').text(msg.message).addClass('other'));
        }
        $('#messages').append($('<br>'));
        $('#messages').append($('<br>'));
      });
    });
  });
}
