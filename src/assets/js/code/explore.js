/* Código extraído desde: https://github.com/gugui3z24/jQuery-Pagination  */

const numberOfItems = $('#page .group').length;
const limitPerPage = 4;
$(`#page .group:gt(${(limitPerPage - 1)})`).hide();
const totalPages = Math.ceil(numberOfItems / limitPerPage);
$('.pagination').append(`<li class='current-page active'><a href='javascript:void(0)'>${1}</a></li>`);

for (let i = 2; i <= totalPages; i++) {
  $('.pagination').append(`<li class='current-page'><a href='javascript:void(0)'>${i}</a></li>`);
}

$('.pagination').append("<li id='next-page'><a href='javascript:void(0)' aria-label=Next><span aria-hidden=true>&raquo;</span></a></li>");


$('.pagination li.current-page').on('click', function () {
  if ($(this).hasClass('active')) {
    return false;
  }
  const currentPage = $(this).index();
  $('.pagination li').removeClass('active');
  $(this).addClass('active');
  $('#page .group').hide();
  const grandTotal = limitPerPage * currentPage;

  for (let i = grandTotal - limitPerPage; i < grandTotal; i++) {
    $(`#page .group:eq(${i})`).show();
  }
});

$('#next-page').on('click', () => {
  let currentPage = $('.pagination li.active').index();
  if (currentPage === totalPages) {
    return false;
  }
  currentPage++;
  $('.pagination li').removeClass('active');
  $('#page .group').hide();
  const grandTotal = limitPerPage * currentPage;

  for (let i = grandTotal - limitPerPage; i < grandTotal; i++) {
    $(`#page .group:eq(${i})`).show();
  }

  $(`.pagination li.current-page:eq(${currentPage - 1})`).addClass('active');
});

$('#previous-page').on('click', () => {
  let currentPage = $('.pagination li.active').index();
  if (currentPage === 1) {
    return false;
  }
  currentPage--;
  $('.pagination li').removeClass('active');
  $('#page .group').hide();
  const grandTotal = limitPerPage * currentPage;

  for (let i = grandTotal - limitPerPage; i < grandTotal; i++) {
    $(`#page .group:eq(${i})`).show();
  }

  $(`.pagination li.current-page:eq(${currentPage - 1})`).addClass('active');
});
