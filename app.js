/* INSTALAR AS SEGUINTES DEPENDÊNCIAS:
npm i express
npm i xmlhttprequest
npm i node-datetime
*/
var util = require('./utils/utils');
var apiRequest = require('./api-requests/btcTrade-api-requests');
var modulesExternal = require('./app-modules/foreign-operations-modules');
var modulesBtcTrade = require('./app-modules/btcTrade-operations-modules');
var server = require('./api_server/server');


util.showLog("App Started...");

function monitoringExternal() {
    modulesExternal.checkVariationPrice();
    modulesExternal.getPrice();
    monitoringBtcTrade();
}

function monitoringBtcTrade() {
    modulesBtcTrade.checkVariationPrice();
    modulesBtcTrade.getPrice();
}

function recursive() {

    server.startServer();

    setInterval(() => {
        monitoringExternal()
    }, 5000);
}

//apiRequest.getPrice();

recursive();