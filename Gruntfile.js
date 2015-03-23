'use strict';
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  function addZero(number) {
    return number < 10 ? ('0' + number) : number;
  }

  function getDateTime() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    
    return date.getFullYear() + '-' + addZero(month) + '-' + addZero(date.getDate()) + ' ' + date.getHours() + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds());
  }

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
          commitMessage: 'Update site at ' + getDateTime()
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
