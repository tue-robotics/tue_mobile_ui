module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: {
        expand: true,
        cwd: '../',
        src: ['build/', 'utils/.tmp/'],
        options: {
          force: true
        }
      }
    },

    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: '../src/',
            src: ['**.html', 'img/**', '*.png', 'favicon.ico'],
            dest: '../build/'
          }
        ]
      }
    },

    uglify: {
      generated: {
        options: {
          mangle: false // compression breaks stuff
        }
      }
    },

    manifest: {
      dev: {
        options: {
          basePath: "../src/",
          network: ["http://*", "https://*"],
          // preferOnline: true,
          verbose: true,
          timestamp: true
        },
        src: [
              "**.html",
              "**.ico",
              "js/**.js",
              "css/**.css",
              
              "img/**.png",
              "../include/css/**.css",
              "../include/js/**.js",
        ],
        dest: "../src/manifest.appcache"
      },
      build: {
        options: {
          basePath: "../build/",
          network: ["http://*", "https://*"],
          // preferOnline: true,
          verbose: true,
          timestamp: true
        },
        src: [
              "**.html",
              "**.ico",
              "js/**.js",
              "css/**.css",
              "img/**.png",
        ],
        dest: "../build/manifest.appcache"
      }
    },

    jshint: {
      files: ['Gruntfile.js', '../src/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },

    'useminPrepare': {
      html: '../src/**.html',
      options: {
        dest: '../build/'
      }
    },
    usemin: {
      html: ['../build/**/*.html'],
      css: ['../build/**/*.css']
    },

    execute: {
      target: {
        src: ['qrcode-gen.js']
      }
    },

    qunit: {
      files: []
    },

    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '*',
          base: '.',
          directory: '.',
          keepalive: true,
          debug: true,
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-manifest');
  
  grunt.loadNpmTasks('grunt-execute');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('server', ['connect']);
  grunt.registerTask('qr', ['execute']);
  grunt.registerTask('build', [
    'useminPrepare',
    'copy',
    'concat', 'uglify', 'cssmin',
    'usemin',
    'manifest:build',
  ]);

  grunt.registerTask('default', ['build']);
};