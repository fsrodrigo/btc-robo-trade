var util = require('./utils');
var apiRequest = require('./api-requests');
var modules = require('./modules');
var server = require('./server');


util.showLog("App Started...");

function app() {
    modules.getPrice();
    modules.getVariationPrice();
}

function recursive() {

    server.startServer();

    setInterval(() => {
        app()
    }, 5000);
}




recursive();