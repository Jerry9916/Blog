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
      blogCss: {
        files: {
          '_temp/blog/styles/base.css': [
            'assets/styles/font-awesome.css',
            'assets/styles/main.css',
            'assets/styles/page.css'
          ]
        }
      },
      resumeCss: {
        options: {
          separator: ''
        },
        files: {
          '_temp/resume/styles/base.css': [
            'resume/styles/bootstrap.css',
            'resume/styles/font-awesome.css',
            'resume/styles/style.css'
          ]
        }
      },
      resumeScript: {
        options: {
          separator: ';'
        },
        files: {
          '_temp/resume/scripts/base.js': [
            'resume/scripts/jquery.min.js',
            'resume/scripts/jquery.easing.min.js',
            'resume/scripts/jquery.easypiechart.js',
            'resume/scripts/stickUp.js',
            'resume/scripts/custom.js'
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
      },
      resume: {
        files: {
          'resume/styles/base.min.css': ['_temp/resume/styles/base.css']
        }
      }
    },

    uglify: {
      options: {
        banner: '/* Jerry\'s blog */\n',
        keepSpecialComments: 0
      },
      resume: {
        files: {
          'resume/scripts/base.min.js': ['_temp/resume/scripts/base.js']
        }
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
      },

      jekyllServe: {
        command: 'jekyll serve'
      }
    }
  });

  grunt.registerTask('blog', ['clean:temp', 'concat:blogCss', 'cssmin:blog', 'clean:temp']);
  grunt.registerTask('resume', ['clean:temp', 'concat:resumeCss', 'concat:resumeScript', 'cssmin:resume', 'uglify:resume', 'clean:temp']);

  grunt.registerTask('publish', function() {
    return grunt.task.run(['blog', 'resume', 'shell:jekyllBuild', 'githubPages']);
  });
};
