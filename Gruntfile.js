
module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    peg: {
      gherkin: {
        src: 'src/lib/parser.pegjs',
        dest: 'dist/lib/parser.js'
      }
    },

    ts: {
      default: {
        tsconfig: {passThrough: true}
      }
    }
  })

  grunt.registerTask('default', ['peg', 'ts'])
};
