module.change_code = 1;

'use strict';

var alexa = require('alexa-app');
var https = require('https');
var req = require('request');
var app = new alexa.app( 'reminder' );
var Promise = require("bluebird");
var io = require('socket.io')();
var socket = require('socket.io-client')('https://cryptic-sea-98015.herokuapp.com');

//Test for alexa
var alexaText = 'Testing 123';

//Getting data from a Heroku Application (This is a reminders example)
var options = {
  uri: 'https://cryptic-sea-98015.herokuapp.com/reminders',
  method: 'GET',
	headers:{accept:'*/*'}
};

//Connecting to the Heroku Application using Sockets
socket.on('connect', function(){
	console.log('connecting to socket');
	getRequest();
});

//Setting an event called reminderPatient. This is a new event for Alexa.
socket.on('reminderpatient', function(data){
	console.log('new event');
	getRequest();
});

//Setting an event called patientDeleted. This is a new event for Alexa.
socket.on('patientDeleted',function(data){
	console.log('item deleted');
	getRequest();
});

//Disconnecting from Socket.io to the Heroku Application
socket.on('disconnect', function(){});

//Launcing the Alexa application - this is the first thing that will be said.
app.launch( function( request, response ) {
	response.say( 'Welcome to the Reminder application. To get the your reminders ask "what are my reminders"' ).reprompt('Way to go. You got it to run. Bad ass.').shouldEndSession( false );
} );

//Function to get all the reminders from the heroku application.
function getRequest(){
	return new Promise(function(resolve) {
		 req({url: 'https://cryptic-sea-98015.herokuapp.com/reminders'}, function (error, response, body) {
       // Putting the body of the response in a variable which Alexa can call.
		 	 alexaText = body;
		 	 console.log(response.body);
		 	 resolve('body');
		 });
});
}
//If there is an error with the Alexa Application this is going to spit the error out.
app.error = function( exception, request, response ) {
	console.log(exception)
	console.log(request);
	console.log(response);
	response.say( 'Sorry an error occured ' + error.message);
};

//This
app.intent('setReminder',
  {
		"slots":{"reminder":"LIST_OF_REMINDERS"},
    "utterances":[
		"set the reminder {reminder}",
		"remind me to {reminder}"]
  },
  function(request,response) {
		var number = request.slot('reminder');
    response.say('I wiill remind you to '+reminder);
	});

app.intent('getDom',
  {
    "utterances":[
		"what are my reminders",
		"remind me",
		"tell me what are my reminders",
		"Can you tell me what are my reminders"]
  },
  function(request,response) {
		// https://cryptic-sea-98015.herokuapp.com/reminders
	//	response.clear();
		// Promise.all([getRequest()]).then(function(data){
		// 	console.log(data[0]);
		// 	response.clear();
		// 	response.say(data[0]);
		// 	response.card('reMINDer',data[0]);
		// 	response.send();
		// });

		// req({url: 'https://cryptic-sea-98015.herokuapp.com/reminders'}, function (error, respon, body) {
		//    // Do more stuff with 'body' here
		// 	 response.clear();
		// 	 console.log(body);
		// 	 console.log(respon.body);
		// 	 response.say(body).send();
		// 	 response.card('help').send();
		// });
		// getRequest().then(function(data){
		// 	console.log(data);
		// 	response.say('data');
		// });
		//var text = getRequest();

		//setTimeout(function(){
		console.log(alexaText);
		response.say(alexaText).send();
		//response.card(alexaText).send();
	//	response.card('reMINDer',JSON.stringify('Your reminders are: god knows it will not work!')).send();
		//},1000);
		//response.say(getRequest()).send();


  //  var number = request.slot('number');
    //response.say("You asked for the number "+number);
  }
);

module.exports = app;
