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
            '_temp'
          ]
        }]
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      blog: {
        files: {
          '_temp/styles/base.css': [
            'assets/styles/font-awesome.css',
            'assets/styles/main.css',
            'assets/styles/page.css'
          ]
        }
      }
    },

    cssmin: {
      blog: {
        files: {
          'assets/styles/base.min.css': ['_temp/styles/base.css']
        }
      }
    },

    githubPages: {
      target: {
        options: {
          commitMessage: 'Updated site'
        },
        src: '_site'
      }
    },

    shell: {
      jekyllBuild: {
        command: 'jekyll build'
      },

      jekyllServe: {
        command: 'jekyll serve'
      }
    }
  });

  grunt.registerTask('blog', ['clean:temp', 'concat:blog', 'cssmin:blog', 'clean:temp']);

  grunt.registerTask('publish', function() {
    return grunt.task.run(['blog', 'shell:jekyllBuild', 'githubPages']);
  });
};
