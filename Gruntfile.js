module.exports = function(grunt) {
	// 1. Вся настройка находится здесь
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			dist: {
				src: [
					'js/scripts/*.js' // Все JS в папке libs
				],
				dest: 'js/build/production.js'
			}
		},

		uglify: {
			build: {
				src: 'js/build/production.js',
				dest: 'js/build/production.min.js'
			}
		},

		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'img',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'images/build/'
				}]
			}
		},

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
					'js/templates/compiled.js': 'js/templates/hbs/*.hbs'
				}
			}
		},
		requirejs:{
			compile: {
				options: {
					baseUrl: "js/",
					mainConfigFile: "js/main.js",
					optimize: 'uglify',
					name: "main", // assumes a production build using almond
					out: "req/optimized.js",

					done: function(done, output) {
						var duplicates = require('rjs-build-analysis').duplicates(output);

						if (duplicates.length > 0) {
							grunt.log.subhead('Duplicates found in requirejs build:');
							grunt.log.warn(duplicates);
							done(new Error('r.js built duplicate modules, please check the excludes option.'));
						}

						done();
					}
				}
			}
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
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-handlebars');

	// 4. Указываем, какие задачи выполняются, когда мы вводим «grunt» в терминале
	grunt.registerTask('default', ['concat','uglify', 'imagemin', 'requirejs', 'handlebars', 'watch']);

};