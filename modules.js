var util = require('./utils');
var apiRequest = require('./api-requests');

module.exports = {

    getPrice: function() {
        var priceNow = apiRequest.getPrice();
        if (priceNow.httpResponseStatus == 200) {
            deleteBefore24H();
            util.showLog("Bitcoin agora $: " + priceNow.httpResponseText);
            util.saveInFile('priceHistory.txt', ',\n"' +
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
        var variation = '{\n' + util.readFileSync('priceHistory.txt') + '\n}';
        variation = checkVariationPrice(JSON.parse(variation));

        util.showLog('Variação obtida...');
        util.showLog('Low: ' + variation.low);
        util.showLog('High: ' + variation.high);
        util.showLog('Avarege: ' + variation.avarege);

        lowPrice = '{\n' + '"lowPrice" : ' + variation.low + '\n}';
        highPrice = '{\n' + '"highPrice" : ' + variation.high + '\n}';
        avaregePrice = '{\n' + '"avaregePrice" : ' + variation.avarege + '\n}';
        util.saveInFile('lowPrice.json', lowPrice, 'w');
        util.saveInFile('highPrice.json', highPrice, 'w');
        util.saveInFile('avaregePrice.json', avaregePrice, 'w');
    },

    getLowPrice: function() {
        var json = util.readFileSync('lowPrice.json');
        util.showLog('Requisição: getLowPrice = ' + json);
        return JSON.parse(json);
    },

    getHighPrice: function() {
        var json = util.readFileSync('highPrice.json');
        util.showLog('Requisição: getHighPrice = ' + json);
        return JSON.parse(json);
    },

    getAvaregePrice: function() {
        var json = util.readFileSync('avaregePrice.json');
        util.showLog('Requisição: getAvaregePrice = ' + json);
        return JSON.parse(json);
    },

    deleteBefore24H: function() {
        deleteBefore24H();
    }

};

function saveLastPrice(lastPrice) {
    util.showLog('Salvando o ultimo preço obtido... ' + lastPrice);
    lastPrice = '{\n' + '"lastPrice" : ' + lastPrice + '\n}';
    util.saveInFile('lastPrice.json', lastPrice, 'w');
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
    var json = JSON.parse('{\n' + util.readFileSync('priceHistory.txt') + '\n}');
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
    util.saveInFile('priceHistory.txt', valuesLast24H + lastLine, 'w');
    util.showLog('Limpeza efetuada dos registros obtidos antes de: ' + dateLasts24H);
}

function getPercentVariationLastPrice(newPrice) {
    var json = JSON.parse(util.readFileSync('lastPrice.json'));

    oldPrice = 0;
    for (x in json) {
        oldPrice = json[x];
    }
    percentual = util.getVariacaoPercent(newPrice, oldPrice);
    util.showLog('Variação do ultimo preço: ' + percentual + '%');
    json = '{\n' + '"variationPercent" : ' + percentual + '\n}';
    util.saveInFile('variationPercent.json', json, 'w');
}