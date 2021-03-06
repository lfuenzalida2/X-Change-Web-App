import io from '../../../../node_modules/socket.io-client/dist/socket.io';
import '../../../../node_modules/smart-time-ago';

function loadNotifications() {
  $('.notifications-container').empty();
  $.get('/notifications/load', (data) => {
    for (let i = 0; i < data.length; i++) {
      let seen;
      if (data[i].seen) {
        seen = 'seen';
      } else {
        seen = 'unseen';
      }
      $('.notifications-container').append(
        `<form class="notification ${seen}" onClick="submit();" action="/notifications/${data[i].id}" method=POST>
        <input type="hidden" name="_method" value="patch" />
        ${data[i].negotiation.seller.username} quiere negociar contigo.
        <time class="timeago" datetime="${data[i].negotiation.createdAt}">
        </time>
        </form>`,
      );
      $('.timeago').timeago('refresh');
    }
    $('.notifications-container').append('<a class="see-all-notifications" href="/notifications" >Ver todas</a>');
  });
}

$(document).ready(() => {
  $(() => {
    const socket = io();
    socket.on('notification', () => {
      const notificationsCounter = parseInt($('.notifications').attr('data-badge'), 10);
      $('.notifications').attr('data-badge', notificationsCounter + 1);
      $('.notifications').addClass('new');
      if ($('.notifications-container').css('display') === 'block') {
        loadNotifications();
      }
    });
    if ($('.notifications').attr('data-badge') !== '0') {
      $('.notifications').addClass('new');
    }
    $('.notifications').click((event) => {
      event.stopPropagation();
      if ($('.notifications-container').css('display') === 'none') {
        loadNotifications();
        $('.notifications-container').css('display', 'block');
      } else {
        $('.notifications-container').css('display', 'none');
      }
    });
    $(document).click((e) => {
      const container = $('.notifications-container');
      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
      }
    });
    if ($('#create-negotiation').length > 0) {
      $('#create-negotiation').submit(function () {
        $.post(
          $(this).attr('action'), // The URL to send form data to
          $(this).serialize(),
          (data) => {
            socket.emit('notification', data.customerId);
            $(window).attr('location', data.redirect);
          },
        );
        return false;
      });
    }
  });
});
