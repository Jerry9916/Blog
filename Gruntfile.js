'use strict';
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  grunt.initConfig({

    clean: {
      temp: {
        files: [{
          dot: true,
          src: [
            '_temp',
          ]
        }]
      }
    },

    concat: {
      css: {
        files: {
          '_temp/blog/styles/base.css': [
            'assets/styles/font-awesome.css',
            'assets/styles/main.css',
            'assets/styles/responsive.css',
            'assets/styles/page.css',
            'assets/styles/nprocess.css',
            'assets/styles/rocket.css',
            'assets/styles/code.css'
          ]
        }
      }
    },

    cssmin: {
      options: {
        banner: '/* Jerry\'s blog */\n',
        keepSpecialComments: 0
      },
      blog: {
        files: {
          'assets/styles/base.min.css': ['_temp/blog/styles/base.css']
        }
      }
    },

    uglify: {
      options: {
        banner: '/* Jerry\'s blog */\n',
        keepSpecialComments: 0
      }
    },

    githubPages: {
      site: {
        options: {
          commitMessage: 'Updated site'
        },
        src: '_site'
      }
    },

    shell: {
      jekyllBuild: {
        command: 'jekyll build'
      }
    }
  });

  grunt.registerTask('blog', ['clean', 'concat', 'cssmin', 'clean']);

  grunt.registerTask('publish', function() {
    return grunt.task.run(['blog', 'shell:jekyllBuild', 'githubPages']);
  });
};
