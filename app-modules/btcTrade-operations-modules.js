var util = require('../utils/utils');
var apiRequest = require('../api-requests/btcTrade-api-requests');
var filePriceHistory = './db_resources/btcTrade/priceHistory.txt';
var fileLowPrice = './db_resources/btcTrade/lowPrice.json';
var fileHighPrice = './db_resources/btcTrade/highPrice.json';
var fileAvaregePrice = './db_resources/btcTrade/avaregePrice.json';
var fileLastPrice = './db_resources/btcTrade/lastPrice.json';
var fileVariationPercent = './db_resources/btcTrade/variationPercent.json';
var corretora = "BtcTrade - ";
module.exports = {

    getPrice: function() {
        var priceNow = apiRequest.getPrice();
        if (priceNow.httpResponseStatus == 200) {
            deleteBefore24H();
            util.showLog(corretora + "Bitcoin agora R$: " + priceNow.httpResponseText);
            util.saveInFile(filePriceHistory, ',\n"' +
                util.getDate(0) + '" : ' +
                priceNow.httpResponseText, 'a');
            getPercentVariationLastPrice(priceNow.httpResponseText);
            saveLastPrice(priceNow.httpResponseText);

        } else {
            util.showLog(corretora + "Não foi possível obter o valor na BtcTrade. Response code of request: " +
                priceNow.httpResponseStatus);
        }
    },

    checkVariationPrice: function() {
        var variation = '{\n' + util.readFileSync(filePriceHistory) + '\n}';
        variation = checkVariationPrice(JSON.parse(variation));

        util.showLog(corretora + 'Variação obtida...');
        util.showLog(corretora + 'Low: ' + variation.low);
        util.showLog(corretora + 'High: ' + variation.high);
        util.showLog(corretora + 'Avarege: ' + variation.avarege);

        lowPrice = '{\n' + '"lowPrice" : ' + variation.low + '\n}';
        highPrice = '{\n' + '"highPrice" : ' + variation.high + '\n}';
        avaregePrice = '{\n' + '"avaregePrice" : ' + variation.avarege + '\n}';
        util.saveInFile(fileLowPrice, lowPrice, 'w');
        util.saveInFile(fileHighPrice, highPrice, 'w');
        util.saveInFile(fileAvaregePrice, avaregePrice, 'w');
    },

    getLowPrice: function() {
        var json = util.readFileSync(fileLowPrice);
        util.showLog(corretora + 'Requisição: getLowPrice = ' + json);
        return JSON.parse(json);
    },

    getHighPrice: function() {
        var json = util.readFileSync(fileHighPrice);
        util.showLog(corretora + 'Requisição: getHighPrice = ' + json);
        return JSON.parse(json);
    },

    getLastPrice: function() {
        var json = util.readFileSync(fileLastPrice);
        util.showLog(corretora + 'Requisição: getLastPrice = ' + json);
        return JSON.parse(json);
    },

    getAvaregePrice: function() {
        var json = util.readFileSync(fileAvaregePrice);
        util.showLog(corretora + 'Requisição: getAvaregePrice = ' + json);
        return JSON.parse(json);
    },

    getVariationPercent: function() {
        var json = util.readFileSync(fileVariationPercent);
        util.showLog(corretora + 'Requisição: getVariationPercent = ' + json);
        return JSON.parse(json);
    },

    deleteBefore24H: function() {
        deleteBefore24H();
    }

};

function saveLastPrice(lastPrice) {
    util.showLog(corretora + 'Salvando o ultimo preço obtido... ' + lastPrice);
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
    util.showLog(corretora + 'Limpeza efetuada dos registros obtidos antes de: ' + dateLasts24H);
}

function getPercentVariationLastPrice(newPrice) {
    var json = JSON.parse(util.readFileSync(fileLastPrice));

    oldPrice = 0;
    for (x in json) {
        oldPrice = json[x];
    }
    percentual = util.getVariacaoPercent(newPrice, oldPrice);
    util.showLog(corretora + 'Variação do ultimo preço: ' + percentual + '%');
    json = '{\n' + '"variationPercent" : ' + percentual + '\n}';
    util.saveInFile(fileVariationPercent, json, 'w');
}