var util = require('../utils/utils');
var https = require('https');

module.exports = {

    getPrice: function() {
        return getTicker();
        //console.log(returnBtcTrade.httpResponseText);
    }
};

function getTicker() {
    url = 'https://api.bitcointrade.com.br/v2/public/BRLBTC/ticker';
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(null);
    util.showLog("Retorno da Requisição da API BitcoinTrade: " + xmlHttp.status);
    var json = JSON.parse(xmlHttp.responseText);
    return {
        httpResponseStatus: xmlHttp.status,
        httpResponseText: getJustLastPrice('data', json)
    };
}


function getJustLastPrice(key, json) {
    return json[key].last.toFixed(2);
}