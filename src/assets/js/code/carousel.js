let slideIndex = 1;

function showSlides(n) {
  let i;
  const slides = document.getElementsByClassName('mySlides');
  const dots = document.getElementsByClassName('dot');
  const captions = document.getElementsByClassName('caption');
  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
    if (captions.length) {
      captions[i].style.display = 'none';
    }
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(' active', '');
  }
  slides[slideIndex - 1].style.display = 'block';
  if (captions.length) {
    captions[slideIndex - 1].style.display = 'block';
  }
  dots[slideIndex - 1].className += ' active';
}

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

window.onload = function () {
  if ($('.slideshow-container').length > 0) {
    showSlides(slideIndex);
    document.getElementsByClassName('prev')[0].addEventListener('click', () => plusSlides(-1), false);
    document.getElementsByClassName('next')[0].addEventListener('click', () => plusSlides(1), false);
    const dots = document.getElementsByClassName('dot');
    for (let i = 0; i < dots.length; i++) {
      dots[i].addEventListener('click', () => currentSlide(i + 1), false);
    }
  }
};
