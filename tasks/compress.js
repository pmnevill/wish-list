'use strict';


module.exports = function mochacli(grunt) {
  // Load task
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Options
  return {
    main: {
      src: ['config/**', 'controllers/**', 'lib/**', 'utils/**', '.ebextensions/**', 'public/dist/**', 'index.js', 'package.json', 'server.js', '.npmrc'],
      options: {
        archive: 'build.zip'
      }
    }
  };
};
