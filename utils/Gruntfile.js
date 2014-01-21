module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ["build"],

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'include/js/jquery-2.0.3.min.js',
          'include/js/bootstrap.min.js',
          'include/js/jquery.hammer.js',
          'include/js/snap.min.js',
          'include/js/jquery.ba-hashchange.js',

          'include/js/eventemitter2.js',
          'include/js/roslib.js',

          'src/js/teleop.js',
          'src/js/teleop-amigo.js',
          'src/js/style.js',
          'src/js/button-handler.js'
        ],
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        files: {
          'build/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js'],
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
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('server', ['connect']);
  grunt.registerTask('build', ['clean', 'concat', 'uglify']);

  grunt.registerTask('default', ['build', 'connect']);
};