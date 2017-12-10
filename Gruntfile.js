
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    ts: {
      default: {
        tsconfig: {passThrough: true}
      }
    }
  })

  grunt.registerTask('default', ['ts']);
};
