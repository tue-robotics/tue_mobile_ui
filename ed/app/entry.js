// import css
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/css/bootstrap.css";
import "angular-circular-navigation/angular-circular-navigation.css";
import "font-awesome/css/font-awesome.min.css";
import './styles/main.css';

// import js

import 'angular-circular-navigation/angular-circular-navigation'
import 'ngdraggable';
import 'bootstrap/js/tab';

import './scripts/app'

import './scripts/controllers/actions';
import './scripts/controllers/circularmenu';
import './scripts/controllers/connection';
import './scripts/controllers/ed';
import './scripts/controllers/jointcontroller';
import './scripts/controllers/main';
import './scripts/controllers/modellist';
import './scripts/controllers/sidebar';
import './scripts/controllers/snapshotlist';
import './scripts/controllers/speech';
import './scripts/controllers/teleop';

import './scripts/controllers/hardware/battery.js'
import './scripts/controllers/hardware/ebuttons.js'

import './scripts/directives/ngteleopcanvas'
import './scripts/directives/ngwebgl'
import './scripts/orbitControls'
import './scripts/run'
import './scripts/services/robot'

// preload html

angular
  .module('EdGuiApp')
  .run(['$templateCache', function($templateCache) {
    // $templateCache.put('views/main.html', require('./views/main.html'));
    $templateCache.put('views/scene.html', require('./views/scene.html'));
    $templateCache.put('views/hardware.html', require('./views/hardware.html'));
    $templateCache.put('views/tabs/teleop_tabs/base.html', require('./views/tabs/teleop_tabs/base.html'));
    $templateCache.put('views/tabs/teleop_tabs/head.html', require('./views/tabs/teleop_tabs/head.html'));
    $templateCache.put('views/tabs/teleop_tabs/speech.html', require('./views/tabs/teleop_tabs/speech.html'));
    $templateCache.put('views/tabs/teleop_tabs/body.html', require('./views/tabs/teleop_tabs/body.html'));
    $templateCache.put('views/tabs/teleop_tabs/ed.html', require('./views/tabs/teleop_tabs/ed.html'));
    $templateCache.put('views/tabs/teleop.html', require('./views/tabs/teleop.html'));
    $templateCache.put('views/tabs/editor.html', require('./views/tabs/editor.html'));
    $templateCache.put('views/tabs/actions.html', require('./views/tabs/actions.html'));
    // $templateCache.put('views/main.html', require('./views/main.html'));
  }]);
