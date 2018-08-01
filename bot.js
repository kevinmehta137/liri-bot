// Require node package for LIRIBOT
var Request = require('request');
var Spotify = require('spotify'); 
var Twitter = require('twitter');
var fs = require('fs'); 

// Load Keys from Keys.js
var key= require('./keys.js');