'use strict';
$(document).ready(function() {
  NProgress.set(0.2);
  setTimeout(function() {
    NProgress.done();
  }, 500);

  var totop = $('#totop');
  var rocket = totop.find('.rocket');
  $(window).scroll(function() {
    if ($(window).scrollTop() >= 200) {
      totop.fadeIn(500);
    } else {
      totop.fadeOut(500);
    }
  });

  rocket.click(function() {
    rocket.addClass('launch');
    $('html, body').animate({
      scrollTop: 0
    }, 1500, function() {
      rocket.removeClass('launch');
    });
    return false;
  });
});
