(function ($) {
  "use strict";

// for banner height js
  var windowWidth = $(window).width();
  var windowHeight = $(window).height();
  $('.banner').css({'width': windowWidth, 'height': windowHeight - "60"});


// for skill chat jquary
  $(document).ready(function (e) {
//var windowBottom = $(window).height();
    var index = 0;
    $(document).scroll(function () {
      var top = $('.technical').height() - $(window).scrollTop();
      if (top < -300) {
        if (index == 0) {

          $('.chart').easyPieChart({
            easing: 'easeOutBounce',
            onStep: function (from, to, percent) {
              $(this.el).find('.percent').text(Math.round(percent));
            }
          });

        }
        index++;
      }
    });
  });


// Somth page scroll
  $(function () {
    $('a[href*=#]:not([href=#])').click(function () {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top - 60
          }, 1000);
          return false;
        }
      }
    });
  });


// chart loding
  $(window).load(function () {

    var chart = window.chart = $('.chart').data('easyPieChart');
    $('.js_update').on('click', function () {
      chart.update(Math.random() * 100);
    });
  });


}(jQuery));
