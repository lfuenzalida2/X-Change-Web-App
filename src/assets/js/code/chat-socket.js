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
        $('#messages').append($('<li>').text(msg));
      });
    });
  });
}
