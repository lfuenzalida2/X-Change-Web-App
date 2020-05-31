import io from '../../../../node_modules/socket.io-client/dist/socket.io';

if ($('#chat').length > 0) {
  $(document).ready(() => {
    $(() => {
      const socket = io();
      $('#send-message').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        $.post(
          $(this).attr('action'), // The URL to send form data to
          $(this).serialize(),
          (data) => {
            socket.emit('chat message', data);
            $('#m').val('');
          },
        );
        return false;
      });
      socket.on('chat message', (msg) => {
        if (msg.senderId === msg.currentUserId && msg.currentUserId !== msg.receiverId) {
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
