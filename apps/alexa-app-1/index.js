module.change_code = 1;
'use strict';

// Requring our needed Node Modules.
var https = require('https');
var req = require('request');
var Promise = require("bluebird");
var alexa = require('alexa-app');

// Setting up the new Alexa Application - It is going to be called lilly.
var app = new alexa.app('lilly');

// Creating an empty string for the Alexa Test to be put into. This is going to be what Alexa says.
var alexaText = '';

// Connection string for Socket.IO - DO NOT DELETE
var options = {
  uri: 'https://cryptic-sea-98015.herokuapp.com/reminders',
  method: 'GET',
	headers:{accept:'*/*'}
};

// Connecting to the Reminder Application
var socket = require('socket.io-client')('https://cryptic-sea-98015.herokuapp.com');

// On a connection run the getRequest() function below.
socket.on('connect', function(){
	console.log('connecting to socket');
	getRequest();
});

// On a request where there is a new reminder - run this function.
socket.on('reminderpatient', function(data){
	console.log('new event');
	getRequest();
});

// On a request where a reminder needs to be deleted - run this functuion
socket.on('patientDeleted',function(data){
	console.log('item deleted');
	getRequest();
});

// On a disconnection do nothing.
socket.on('disconnect', function(){});

// This function goes to the reminder application and gets all the reminders and then resolves them all.
function getRequest(){
	return new Promise(function(resolve) {
		 req({url: 'https://cryptic-sea-98015.herokuapp.com/reminders'}, function (error, response, body) {
		 	 alexaText = body;
		 	 console.log(response.body);
		 	 resolve(response.body);
		 });
});
}

// Whenver the application is first opened - Alexa should say this command.
app.launch( function(request, response) {
	response.say( 'Welcome to the Reminder app. To get the your reminders ask "what are my reminders"' ).reprompt( 'Way to go. You got it to run. Bad ass.' ).shouldEndSession( false );
} );

// If there is an app error this command should print.
app.error = function( exception, request, response ) {
	console.log(exception)
	console.log(request);
	console.log(response);
	response.say( 'Sorry an error occured ' + error.message);
};

/* The Intent for Setting Reminders. It takes an input of the either
  set the reminder OR remind me to. The {reminder} is a variable; this is the reminder the user wants to remember.
*/
app.intent('setReminder',
  {
		"slots":{ "reminder":"LIST_OF_REMINDERS" },
    "utterances":
    [ "set the reminder {reminder}"]
  },
  function(request,response) {
		var number = request.slot('reminder');
    response.say('I will remind you to '+ reminder);
	});


  /* The Intent for Getting Reminders. It takes an input of everything in the utterances array. */
app.intent('getReminder',
  {
    "utterances":
    ["what are my reminders"]
  },
  function(request,response) {
		console.log(alexaText);
		response.say(alexaText).send();

  }
);

module.exports = app;
