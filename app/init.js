require.config({//    baseUrl: 'app/',	paths: {		jquery:     '../vendor/jquery/dist/jquery.min',		underscore: '../vendor/underscore/underscore',		handlebars: '../vendor/handlebars/handlebars.min',		HbsTemplate: 'templates/compiledHbs.min',		QuizzApp:'javascripts/QuizzApp',		Question:'javascripts/Question',		Router: 'javascripts/Router',		Statistics: 'javascripts/Statistics',		LocalStorage: 'javascripts/LocalStorage',		Utils: 'javascripts/Utils'	},	shim: {		jquery: {			exports: '$'		},		underscore: {			exports: '_'		},		handlebars: {			deps:['underscore'],			exports: 'Handlebars'		},		HbsTemplate :{			deps: ['underscore'],			exports: 'HbsTemplate'		},		QuizzApp: ['jquery', 'underscore', 'handlebars', 'HbsTemplate']	}})require(['QuizzApp'], function (app) {	app.init();});