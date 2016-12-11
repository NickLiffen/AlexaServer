
'use strict';

// Requring the Amazon Alexa Server Module.
var AlexaAppServer = require('alexa-app-server');

// Starting the Amazon Alexa Server; it runs similar to Express.
AlexaAppServer.start( {port:process.env.PORT || 8080} );
