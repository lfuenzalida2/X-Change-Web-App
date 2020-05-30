import io from '../../../../node_modules/socket.io-client/dist/socket.io';

if ($('#chat').length > 0) {
  $(document).ready(() => {
    $(() => {
      const socket = io();
      socket.on('connect', () => {
        const url = window.location.pathname;
        const id = url.substring(url.lastIndexOf('/') + 1);
        socket.emit('join chat', { chatId: id });
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
        $('#messages').append($('<li>').text(msg));
      });
    });
  });
}
