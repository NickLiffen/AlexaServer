
'use strict';

// Requring the Amazon Alexa Server Module.
var AlexaAppServer = require('alexa-app-server');

AlexaAppServer.start({
    server_root:__dirname,        // Path to root
    public_html:"public_html",    // Static content
    app_dir:"apps",               // Where alexa-app modules are stored
    app_root:"/alexa/",           // Service root
    port:process.env.PORT || 8080 // What port to use, duh
});
