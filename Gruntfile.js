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
//			build: {
//				src: 'app/templates/compiledHbs.js',
//				dest: 'app/templates/compiledHbs.min.js'
//			}
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

		requirejs: {
			compile: {
				options: {
					appDir: "app/",
					baseUrl: ".",
					dir: "target/",
					optimize: 'uglify',
					mainConfigFile:'./app/init.js',
					modules:[
						{
							name:'MyModule'
						}
					],
					logLevel: 0,
					findNestedDependencies: true,
					fileExclusionRegExp: /^\./,
					inlineText: true
				}
			}
		},

		jshint: {
			options: {
				browser: true,
				white: true,
				smarttabs: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				undef: true,
				trailing: true,
				jquery: true
			},
			files: 'app/javascripts/*.js'
		},

		watch: {
			scripts: {
				files: ['js/app/*.js', 'js/templates/hbs/*.hbs'],
				tasks: ['concat', 'uglify', 'handlebars'],
				options: {
					spawn: false
				}
			}
		}

	});



	// 3. Тут мы указываем Grunt, что хотим использовать этот плагин
//	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
//	grunt.loadNpmTasks('grunt-contrib-imagemin');
//	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-handlebars');
//    grunt.loadNpmTasks('grunt-contrib-jshint');


	// 4. Указываем, какие задачи выполняются, когда мы вводим «grunt» в терминале
	grunt.registerTask('default', ['handlebars','uglify', 'requirejs']);

};