/* INSTALAR AS SEGUINTES DEPENDÊNCIAS:
npm i express
npm i xmlhttprequest
npm i node-datetime
*/
var util = require('./utils');
var apiRequest = require('./api-requests');
var modules = require('./modules');
var server = require('./server');


util.showLog("App Started...");

function app() {
    modules.checkVariationPrice();
    modules.getPrice();
    //modules.deleteBefore24H();

}

function recursive() {

    server.startServer();

    setInterval(() => {
        app()
    }, 5000);
}


//modules.checkVariationPrice();
recursive();