import io from '../../../../node_modules/socket.io-client/dist/socket.io';

const ownerList = {};

if ($('#chat').length > 0) {
  $(document).ready(() => {
    $(() => {
      $('#messages').scrollTop($('#messages')[0].scrollHeight);
      const socket = io();
      socket.on('connect', () => {
        const url = window.location.pathname;
        const owner = $('#currentUser').val();
        const id = url.substring(url.lastIndexOf('/') + 1);

        if (!ownerList[id]) {
          ownerList[id] = owner;
        }
        socket.emit('join negotiation', { negotiationId: id }); // agregar el owner aca
      });
      $('#send-message').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        $.post(
          $(this).attr('action'), // The URL to send form data to
          $(this).serialize(),
          (data) => {
            console.log(data);
            const url = window.location.pathname;
            const id = url.substring(url.lastIndexOf('/') + 1);
            socket.emit('chat message', { negotiationId: id, msg: data });
            $('#m').val('');
          },
        );
        return false;
      });
      socket.on('chat message', (msg) => {
        const role = msg.currentUserId === parseInt(ownerList[msg.negotiationId], 10) ? 'me' : 'other';
        $('#messages').append(`<div class="wrapper-${role}"><div class="${role}"> ${msg.message} <div class="time">${msg.time}</div> </div></div>`);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
      });
    });
  });
}