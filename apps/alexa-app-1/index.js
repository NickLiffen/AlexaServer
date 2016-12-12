module.change_code = 1;
'use strict';

// Requring our needed Node Modules.
var https = require('https');
var req = require('request');
var Promise = require("bluebird");
var alexa = require('alexa-app');
var contentful = require('contentful')
var util = require('util')

// Connection to Contentful
var client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: 'j6yhez93nlyv',
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: '8fd130ff958610701d2b381d216ea3b8571c551531cdc327d6f6798a60af5a28'
})

// Setting up the new Alexa Application - It is going to be called lilly.
var app = new alexa.app('lilly');

// Creating an empty string for the Alexa Test to be put into. This is going to be what Alexa says.
var reminderText = '';
var questionText = '';
var alzheimersText = '';

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
	getReminderContent();
  getDrugQuestionContent();
  getAlzheimersQuestionContent();
});

// On a request where there is a new reminder - run this function.
socket.on('reminderpatient', function(data){
	console.log('new event');
	getReminderContent();
  getDrugQuestionContent();
  getAlzheimersQuestionContent();
});

// On a request where a reminder needs to be deleted - run this functuion
socket.on('patientDeleted',function(data){
	console.log('item deleted');
	getReminderContent();
  getDrugQuestionContent();
  getAlzheimersQuestionContent();
});

// On a disconnection do nothing.
socket.on('disconnect', function(){});

// This function goes to the reminder application and gets all the reminders and then resolves them all.
function getReminderContent(){
	return new Promise(function(resolve) {
		 req({url: 'https://cryptic-sea-98015.herokuapp.com/reminders'}, function (error, response, body) {
		 	 reminderText = body;
		 	 resolve(response.body);
		 });
});
}

// This function goes to the Contnetful Space and Gets informatino about the Questions and Answers
function getDrugQuestionContent(){
  return new Promise(function(resolve) {
    // This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token.
    client.getEntry('4LgMotpNF6W20YKmuemW0a')
    .then(function (entry) {
      questionText = entry.fields.companyDescription;
      resolve(entry.fields.companyDescription);
    })
});
}

// This function goes to the Contnetful Space and Gets informatino about the Questions and Answers
function getAlzheimersQuestionContent(){
  return new Promise(function(resolve) {
    // This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token.
    client.getEntry('4LgMotpNF6W20YKmuemW0a')
    .then(function (entry) {
      questionText = entry.fields.companyDescription;
      resolve(entry.fields.companyDescription);
    })
});
}

// Whenver the application is first opened - Alexa should say this command.
app.launch( function(request, response) {
	response.say('Welcome to the Question and Answer Application. Please ask a question').reprompt( 'Way to go. You got it to run. Bad ass.' ).shouldEndSession( false );
} );

// If there is an app error this command should print.
app.error = function( exception, request, response ) {
	console.log(exception)
	console.log(request);
	console.log(response);
	response.say( 'Sorry an error occured ' + error.message);
};


  /* The Intent for Getting Reminders. It takes an input of everything in the utterances array. */

app.intent('getReminder',
  {
    "utterances":
    ["what are my reminders"]
  },
  function(request,response) {
    console.log(reminderText);
		console.log(reminderText);
		response.say(reminderText).send();

  }
);

app.intent('drugQuestion',
  {
    "utterances":
    ["what drugs do Lilly offer for Alzheimers"]
  },
  function(request,response) {
		response.say(questionText).send();

  }
);

app.intent('AlzheimersLilly',
  {
    "utterances":
    ["what can i do to help with my Alzheimers"]
  },
  function(request,response) {
		response.say(questionText).send();

  }
);

module.exports = app;
