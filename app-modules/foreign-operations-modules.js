var util = require('../utils/utils');
var apiRequest = require('../api-requests/external-api-requests');
var filePriceHistory = './db_resources/priceHistory.txt';
var fileLowPrice = './db_resources/lowPrice.json';
var fileHighPrice = './db_resources/highPrice.json';
var fileAvaregePrice = './db_resources/avaregePrice.json';
var fileLastPrice = './db_resources/lastPrice.json';
var fileVariationPercent = './db_resources/variationPercent.json';

module.exports = {

    getPrice: function() {
        var priceNow = apiRequest.getPrice();
        if (priceNow.httpResponseStatus == 200) {
            deleteBefore24H();
            util.showLog("Bitcoin agora $: " + priceNow.httpResponseText);
            util.saveInFile(filePriceHistory, ',\n"' +
                util.getDate(0) + '" : ' +
                priceNow.httpResponseText, 'a');
            getPercentVariationLastPrice(priceNow.httpResponseText);
            saveLastPrice(priceNow.httpResponseText);

        } else {
            util.showLog("Não foi possível obter o valor. Response code of request: " +
                priceNow.httpResponseStatus);
        }
    },

    checkVariationPrice: function() {
        var variation = '{\n' + util.readFileSync(filePriceHistory) + '\n}';
        variation = checkVariationPrice(JSON.parse(variation));

        util.showLog('Variação obtida...');
        util.showLog('Low: ' + variation.low);
        util.showLog('High: ' + variation.high);
        util.showLog('Avarege: ' + variation.avarege);

        lowPrice = '{\n' + '"lowPrice" : ' + variation.low + '\n}';
        highPrice = '{\n' + '"highPrice" : ' + variation.high + '\n}';
        avaregePrice = '{\n' + '"avaregePrice" : ' + variation.avarege + '\n}';
        util.saveInFile(fileLowPrice, lowPrice, 'w');
        util.saveInFile(fileHighPrice, highPrice, 'w');
        util.saveInFile(fileAvaregePrice, avaregePrice, 'w');
    },

    getLowPrice: function() {
        var json = util.readFileSync(fileLowPrice);
        util.showLog('Requisição: getLowPrice = ' + json);
        return JSON.parse(json);
    },

    getHighPrice: function() {
        var json = util.readFileSync(fileHighPrice);
        util.showLog('Requisição: getHighPrice = ' + json);
        return JSON.parse(json);
    },

    getLastPrice: function() {
        var json = util.readFileSync(fileLastPrice);
        util.showLog('Requisição: getLastPrice = ' + json);
        return JSON.parse(json);
    },

    getAvaregePrice: function() {
        var json = util.readFileSync(fileAvaregePrice);
        util.showLog('Requisição: getAvaregePrice = ' + json);
        return JSON.parse(json);
    },

    getVariationPercent: function() {
        var json = util.readFileSync(fileVariationPercent);
        util.showLog('Requisição: getVariationPercent = ' + json);
        return JSON.parse(json);
    },

    deleteBefore24H: function() {
        deleteBefore24H();
    }

};

function saveLastPrice(lastPrice) {
    util.showLog('Salvando o ultimo preço obtido... ' + lastPrice);
    lastPrice = '{\n' + '"lastPrice" : ' + lastPrice + '\n}';
    util.saveInFile(fileLastPrice, lastPrice, 'w');
}

function checkVariationPrice(json) {
    history = [];
    sum = 0;
    for (x in json) {
        history.push(json[x]);
        sum += json[x];
    }
    high = Math.max(...history);
    low = Math.min(...history);
    avarege = sum / history.length;
    return {
        low: low.toFixed(2),
        high: high.toFixed(2),
        avarege: avarege.toFixed(2)
    };
}

function deleteBefore24H() {
    var json = JSON.parse('{\n' + util.readFileSync(filePriceHistory) + '\n}');
    var dateLasts24H = util.getDate(-1);
    var valuesLast24H = '';
    var lastLine = '';
    var keys = Object.keys(json);

    keys.forEach(function(key, i) {
        if (dateLasts24H < key && key != keys[keys.length - 1]) {
            valuesLast24H += '"' + key + '" : ' + json[key] + ',\n';
        } else if (keys.length - 1)
            lastLine = '"' + keys[keys.length - 1] + '" : ' + json[keys[keys.length - 1]];
    });
    util.saveInFile(filePriceHistory, valuesLast24H + lastLine, 'w');
    util.showLog('Limpeza efetuada dos registros obtidos antes de: ' + dateLasts24H);
}

function getPercentVariationLastPrice(newPrice) {
    var json = JSON.parse(util.readFileSync(fileLastPrice));

    oldPrice = 0;
    for (x in json) {
        oldPrice = json[x];
    }
    percentual = util.getVariacaoPercent(newPrice, oldPrice);
    util.showLog('Variação do ultimo preço: ' + percentual + '%');
    json = '{\n' + '"variationPercent" : ' + percentual + '\n}';
    util.saveInFile(fileVariationPercent, json, 'w');
}