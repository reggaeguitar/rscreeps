module.exports = function(grunt) {

    var config = require('./screeps.json');
    var branch = grunt.option('branch') || config.branch;
    var email = grunt.option('email') || config.email;
    var password = grunt.option('password') || config.password;
    var prt = grunt.option('prt') ? true : config.ptr;

    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        screeps: {
            options: {
                email: config.email,
                password: config.password,
                branch: 'default',
                ptr: config.ptr
            },
            dist: {
                src: ['*.js']
            }
        },

        // Remove all files from the dist folder
        clean: {
            'dist' : ['dist']
        },

        copy: {
            screeps: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: '**',
                    dest: 'dist/',
                    filter: 'isFile',
                    rename: function(dest, src) {
                        // Change the path name to utilize underscores for folders
                        return dest + src.replace(/\//g, '_');
                    }
                }]
            }
        }
    });

    grunt.registerTask('default', ['clean', 'copy:screeps']);//, 'screeps']);
}