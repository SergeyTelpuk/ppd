module.exports = function(grunt) {
    // 1. Вся настройка находится здесь
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

//		concat: {
//			dist: {
//				src: [
//					'js/scripts/*.js' // Все JS в папке libs
//				],
//				dest: 'js/build/production.js'
//			}
//		},
//
        uglify: {
            my_target: {
                files: {
                    'app/templates/compiledHbs.min.js': ['vendor/handlebars/handlebars.min.js', 'app/templates/compiledHbs.js']
                }
            }
        },
//
//		imagemin: {
//			dynamic: {
//				files: [{
//					expand: true,
//					cwd: 'img',
//					src: ['**/*.{png,jpg,gif}'],
//					dest: 'images/build/'
//				}]
//			}
//		},

        handlebars: {
            compile: {
                options: {
                    // configure a namespace for your templates
                    namespace: 'HbsTemplate.templates',
                    node: true,
                    wrapped: true,

                    // convert file path into a function name
                    // in this example, I convert grab just the filename without the extension
                    processName: function(filePath) {
                        var pieces = filePath.split('/');
                        return pieces[pieces.length - 1].split('.')[0];
                    }

                },

                // output file: input files
                files: {
                    'app/templates/compiledHbs.js': 'hbsTemplates/*.hbs'
                }
            }
        },

//		requirejs: {
//			compile: {
//				options: {
//					appDir: "app/",
//					baseUrl: ".",
//					dir: "target/",
//					optimize: 'uglify',
//					mainConfigFile:'./app/init.js',
//					modules:[
//						{
//							name:'MyModule'
//						}
//					],
//					logLevel: 0,
//					findNestedDependencies: true,
//					fileExclusionRegExp: /^\./,
//					inlineText: true
//				}
//			}
//		},


        jasmine: {
            taskName: {
                src: 'javascripts/*.js',
                options: {
                    specs: 'specs/*_spec.js',
                    helpers: 'specs/helper/*.js',
                    template: require('grunt-template-jasmine-requirejs'),
                    vendor: [
                        'vendor/jquery/dist/jquery.js',
                        'vendor/jasmine-jquery/lib/jasmine-jquery.js',
                        'vendor/jasmine-ajax/lib/mock-ajax.js'
                    ],
                    templateOptions: {
                        requireConfigFile: 'app/init.js'
                    }
                }
            }
        },
//        requirejs: {
//            compile: {
//                options: {
//                    baseUrl: "app",
//                    mainConfigFile: "app/init.js",
//                    out: "path/to/optimized.js"
//                }
//            }
//        },


        watch: {
            scripts: {
                files: ['specs/*.js'],
                tasks: ['jasmine'],
                options: {
                    spawn: false
                }
            }
        }
    });

    // 3. Тут мы указываем Grunt, что хотим использовать этот плагин
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    //grunt.loadNpmTasks('grunt-contrib-requirejs');


    // 4. Указываем, какие задачи выполняются, когда мы вводим «grunt» в терминале
    grunt.registerTask('default', ['handlebars','uglify' ,'jasmine', 'watch']);

};