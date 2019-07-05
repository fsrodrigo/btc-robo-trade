var util = require('../utils/utils');

module.exports = {

    httpResponse: function(url, corretora) {
        return httpResponse(url, corretora);
    }
};

function httpResponse(url, corretora) {
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(null);
    while (xmlHttp.status != 200) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, false);
        xmlHttp.setRequestHeader('Content-Type', 'application/json');
        xmlHttp.send(null);
    }
    util.showLog("Retorno da Requisição da API " + corretora + ": " + xmlHttp.status);
    var json = xmlHttp.responseText;
    return {
        httpResponseStatus: xmlHttp.status,
        httpResponseText: json
    };
}