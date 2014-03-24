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
            src: ['**.html', 'img/*.png', '*.png', 'favicon.ico'],
            dest: '../build/'
          },
          {
            expand: true,
            cwd: '../include',
            src: ['fonts/*'],
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

    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '*',
          base: '../',
          directory: '../',
          keepalive: true,
          debug: true,
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  
  grunt.loadNpmTasks('grunt-execute');

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('server', ['connect']);
  grunt.registerTask('qr', ['execute']);
  grunt.registerTask('build', [
    'clean',
    'useminPrepare',
    'copy',
    'concat', 'uglify', 'cssmin',
    'usemin',
  ]);

  grunt.registerTask('default', ['build']);
};