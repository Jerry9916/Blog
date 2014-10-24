'use strict';
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  grunt.initConfig({
    githubPages: {
      target: {
        options: {
          commitMessage: 'Updated site'
        },
        src: '_site'
      }
    }
  });
  grunt.registerTask('build', ['githubPages:target']);
};
