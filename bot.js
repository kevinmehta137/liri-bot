// Require node package for LIRIBOT
var Request = require('request');
var Spotify = require('spotify'); 
var Twitter = require('twitter');
var fs = require('fs'); 

// Load Keys from Keys.js
var key= require('./keys.js');
console.log(key);

var twitterclient = new Twitter(key.twitter);
console.log(key.twitter);
console.log(key.twitter.consumer_key);

var action = process.argv[2];

var mytweets = "MyTweets";
var spotifysong = "SpotifySong";
var thismovie= "MyMovie";
var doit= "Doit";
if(  action === mytweets){
    listTweets();
}else if(action === spotifysong){
    spotifyThis();
}else if(action === thismovie){
    movieLookUp();
}else if(action === doit)
{
    doIt();
}else{
    Console.log("Please Enter Correct Command");
}


// TWITTER 
// This will show my last 20 tweets and when they were created in terminal/bash
function listTweets(){
	var params = {screen_name: "wutup_castleman"};	

	client.get('search/tweets', {q: "wutup_castleman"}, function(error, tweets, response){
		if (error){
		  	console.log('error:', error); // Print the error if one occurred 
		  	console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
	  	} else {
	  		for (i=0;i<tweets["statuses"].length;i++){
	  			console.log("----------------------");
	  			console.log("Bryan tweeted: '" + tweets["statuses"][i].text +"'"); 
	  			console.log("Tweeted on: " + tweets["statuses"][i]["created_at"]);
	  		}
	  		
	  	}
	});
}		


// SPOTIFY
function spotifyThis(){	
	
	var nodeArgs = process.argv; 
	var song = "";

	for (i=3;i<nodeArgs.length;i++){
		// takes arguments, separates them with a space and stores them as a string in the song variable 	
  		song = song + " " + nodeArgs[i];
	}

	// if no song is provided the default song "Midnight City" will be queried
	if (nodeArgs.length === 3){
		song = "Midnight City";
	}

	console.log("Searching for: " + song);
	
	Spotify.search({ type: 'track', query: song }, function(error, data) {
	    
	    if (error) {
	        console.log('Error occurred: ' + error);
	        return;
	    } else {
	    	console.log("---------------------");
	    	// Artist(s)
	    	console.log("Artist(s): " + data["tracks"].items[1].artists[0].name);
	    	// The song's name
	    	console.log("Song Title: " + data["tracks"].items[0].name);
	    	// A preview link of the song from Spotify
	    	console.log("Preview Link: " + data["tracks"].items[0].preview_url);
	    	// The album that the song is from
	    	console.log("Album Name: " + data["tracks"].items[0].album.name);
	    	console.log("---------------------");			
	    }
 
	});
}

// OMDB API using REQUEST
function movieLookUp(){	

	var nodeArgs = process.argv; 
	var movie = nodeArgs[3];

	for (i=4;i<nodeArgs.length;i++){
		// stores arguments into a string separted by + symbol		
		movie += "+" + nodeArgs[i];
	}

	//  If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
	if (nodeArgs[3] === undefined){
		movie = "Mr+Nobody";
	}

	var movieQueryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=full&tomatoes=true&r=json";

	 console.log(movieQueryURL)
	 console.log("Searching for:" + movie);


	// uses the Request Node package to query the OMDB API 
	Request(movieQueryURL, function (error, response, body) {

	  if (error){
	  	console.log('error:', error); // Print the error if one occurred 
	  	console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
	  } else {
	  	console.log("Type of body is: " + typeof body);

	  	// turns string into an object
	  	var obj = JSON.parse(body);
	  	console.log(obj);

	  	console.log("----------");
	  	// Title of the movie.
	  	console.log("Title: " + obj["Title"]);
	  	// Year the movie came out.
	  	console.log("Year: " + obj["Year"]);
	  	// IMDB Rating of the movie.
	  	console.log("IMDB Rating: " + obj["imdbRating"]);
	  	//  Country where the movie was produced.
	  	console.log("Produced in: " + obj["Country"]);
	  	//  Language of the movie.
	  	console.log("Language: " + obj["Language"]);
	  	//  Plot of the movie.
	  	console.log("Plot: " + obj["Plot"]);
	  	//  Actors in the movie.
	  	console.log("Actors: " + obj["Actors"]);
	  	//  Rotten Tomatoes Rating.
	  	console.log("Rotten Tomatoes Rating: " + obj.Ratings[1].Value);
	  	// Rotten Tomatoes URL 
	  	console.log("Rotten Tomatoes URL: " + obj.tomatoURL); 	
	  	console.log("----------");
	  }	  
	});
}

function doIt(){

  	// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
  	// By default it will run spotify-this-song  for "I Want it That Way," as follows the text in random.txt 
	
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error){
		  	console.log('error:', error); // Print the error if one occurred 
		  	console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
		} else { 
		  console.log(data);
		  // removes quotation marks from strings 
		  var cleanData = data.replace(/['"]+/g, '');

		   console.log(cleanData);
		   console.log(typeof cleanData);
		   console.log(cleanData.length);

		  // splits the remaining data into an array at the comma
		  var commands = cleanData.split(",");

		  console.log(commands[0]);
		   console.log(commands[1]);		  

		  for(i=0;i<commands.length;i++)
		  	// each "command" from the text file is assigned as an argument 
		  	process.argv[i+2] = commands[i];

		  }

		  
		   console.log(process.argv[2]);
		   console.log(process.argv[3]);
		  
		  // switch statement uses data from random.txt to run LIRI.js functions
		  var action = process.argv[2];

			switch (action) {
			  case "my-tweets":
			    listTweets();
			    break;

			  case "spotify-this-song":			  	
			    spotifyThis();
			    break;

			  case "movie-this":
			    movieLookUp();
			    break;
			}

		});
}