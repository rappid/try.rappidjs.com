module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({

        // Metadata
        meta: {
            basePath: 'public/try/',
            cssPath: 'css/'
        },

        // Task configuration
        sass: {
            dist: {
                options: {
//                    outputStyle: 'compressed',
                    debugInfo: false,
                    force: true
                },
                files: {
                    '<%= meta.basePath %><%= meta.cssPath %>try.css': '<%= meta.basePath %><%= meta.cssPath %>try.scss'
                }
            }
        },

        autoprefixer: {
            dist: {
                options: {
                    browsers: ['last 2 version', '> 1%', 'ie 9']
                },
                files: {
                    '<%= meta.basePath %><%= meta.cssPath %>tablomat-all.css': '<%= meta.basePath %><%= meta.cssPath %>tablomat.css'
                }
            }
        },

        // Watcher
        watch: {
            scss: {
                files: ['<%= meta.basePath %><%= meta.cssPath %>**/*.scss'],
                tasks: ['sass','autoprefixer']
            }
        }

    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['sass', 'autoprefixer']);

};