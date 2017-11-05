import $ from 'jquery';
import Snap from 'snapjs';

$( document ).ready(function() {
  /* Menu Toggle button */

  // Initialize snapper
  var snapper = new Snap({
    element: document.getElementById('content'),
  });

  $(window).on('hashchange', function() {
    var hash = window.location.hash;
    if (!hash) {
      return;
    }

    // remove all active classes in #main
    $('#main > .active').removeClass('active');

    // create active page
    var page = $(hash);
    page.addClass('active');

    // slide back
    snapper.close();

    // set title
    $('#toolbar h1').html(page.data('title'));
  })
  $(window).trigger('hashchange');

  $('#open-left').click(function() {
    if (snapper.state().state === 'left'){
      snapper.close();
    } else {
      snapper.open('left');
    }
  });

  $('#toggle-options').click(function() {
    if (snapper.state().state === 'right' ){
      snapper.close();
    } else {
      snapper.open('right');
    }
  });
});

/* Prevent Safari opening links when viewing as a Mobile App */
/* jshint ignore:start */
(function (a, b, c) {
  if (c in b && b[c]) {
    var d, e = a.location,
      f = /^(a|html)$/i;
    a.addEventListener('click', function (a) {
      d = a.target;
      while (!f.test(d.nodeName)) d = d.parentNode;
      'href' in d && (d.href.indexOf('http') || ~d.href.indexOf(e.host)) && (a.preventDefault(), e.href = d.href)
    }, !1)
  }
})(document, window.navigator, 'standalone');
/* jshint ignore:end */
