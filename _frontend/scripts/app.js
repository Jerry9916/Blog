'use strict';
$(document).ready(function() {
  NProgress.set(0.2);
  setTimeout(function() {
    NProgress.done();
  }, 500);
});
