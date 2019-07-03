var util = require('./utils');
module.exports = {


    getPrice: function() {
        url = 'https://blockchain.info/ticker';
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, false);
        xmlHttp.send(null);
        util.showLog("Retorno da Requisição: " + xmlHttp.status);
        var json = JSON.parse(xmlHttp.responseText);
        return {
            httpResponseStatus: xmlHttp.status,
            httpResponseText: getPriceSpecifyCurrency('USD', json)
        };


    }
};

function getPriceSpecifyCurrency(currency, json) {
    return json[currency].last.toFixed(2);
}