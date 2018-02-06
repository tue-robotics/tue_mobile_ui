'use strict';

angular.module('challengeOpenApp')
  .run(function() {
    /* global FastClick */
    FastClick.attach(document.body);

    var initialY = null;
    document.ontouchstart = function(e) {
      initialY = e.pageY;
    };

    document.ontouchend = function(e) {
      initialY = null;
    };

    document.ontouchcancel = function(e) {
      initialY = null;
    };

    function inModels(node) {
      var in_scroller = false;
      while (node !== document) {
        if (node.classList.contains("models")) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    }

    function inSnapshots(node) {
      var in_scroller = false;
      while (node !== document) {
        if (node.classList.contains("snapshots")) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    }

    document.ontouchmove = function(e) {
      if(initialY !== null) {
        if(!inModels(e.target) && !inSnapshots(e.target)) {
          // The element to be scrolled is not the content node
          e.preventDefault();
          return;
        }

        var direction   = e.pageY - initialY;

        // modelsNode
        var modelsNode = document.getElementsByClassName("models")[0];

        if (inSnapshots(e.target)) {
          if (abs(direction) < 3) {

          } else {
            e.preventDefault();
          }
        }

        if(direction > 0 && modelsNode.scrollTop <= 0) {
          // The user is scrolling up, and the element is already scrolled to top
          e.preventDefault();
        } else if(direction < 0 && modelsNode.scrollTop >= modelsNode.scrollHeight - modelsNode.clientHeight) {
          // The user is scrolling down, and the element is already scrolled to bottom
          e.preventDefault();
        }
      }
    };

  });
