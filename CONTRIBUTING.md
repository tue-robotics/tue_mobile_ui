Build Setup
====================

[Grunt](http://gruntjs.com/) is used for building, including concatenating, minimizing, documenting, linting, and testing.

[Bower](http://bower.io/) is used for downloading and managing client-side needed js libraries (e.g. JQuery).

### Install Grunt, Bower and their Dependencies

 1. Install Node.js and its package manager, NPM
   * `sudo apt-get install python-software-properties`
   * `sudo add-apt-repository ppa:chris-lea/node.js`
   * `sudo apt-get update && sudo apt-get install nodejs phantomjs`
 2. Install Grunt and Bower
   * `sudo -H npm install -g grunt-cli bower`
 3. Install other dependencies
   * `sudo apt-get install libgif-dev`
 4. Install the Grunt tasks specific to this project
   * `roscd tue_mobile_ui/utils`
   * `npm install .`
   * `bower install`

### Build with Grunt

Before proceeding, please confirm you have installed the dependencies above.

To run the build tasks:

 1. `roscd tue_mobile_ui/utils/`
 2. `grunt build`

`grunt build` will build the app in the build directory. It will also run the linter and test cases.

`grunt serve` will watch for any changes to any of the src/ files and automatically build the files. This is ideal for those developing as you should only have to run `grunt serve` once.