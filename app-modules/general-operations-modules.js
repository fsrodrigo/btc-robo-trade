var util = require('../utils/utils');

module.exports = {

    getPrice: function(corretora, filePriceHistory, filePriceHistoryBackup, fileLastPrice, fileVariationPercent, priceNow) {
        getPrice(corretora, filePriceHistory, filePriceHistoryBackup, fileLastPrice, fileVariationPercent, priceNow);
    },

    checkVariationPrice: function(corretora, filePriceHistory, filePriceHistoryBackup, fileLowPrice, fileHighPrice, fileAvaregePrice) {
        checkVariationPrice(corretora, filePriceHistory, filePriceHistoryBackup, fileLowPrice, fileHighPrice, fileAvaregePrice);
    },

    getLowPrice: function(corretora, fileLowPrice) {
        var json = util.readFileSync(fileLowPrice);
        util.showLog(corretora + 'Requisição: getLowPrice = ' + json);
        return JSON.parse(json);
    },

    getHighPrice: function(corretora, fileHighPrice) {
        var json = util.readFileSync(fileHighPrice);
        util.showLog(corretora + 'Requisição: getHighPrice = ' + json);
        return JSON.parse(json);
    },

    getLastPrice: function(corretora, fileLastPrice) {
        var json = util.readFileSync(fileLastPrice);
        util.showLog(corretora + 'Requisição: getLastPrice = ' + json);
        return JSON.parse(json);
    },

    getAvaregePrice: function(corretora, fileAvaregePrice) {
        var json = util.readFileSync(fileAvaregePrice);
        util.showLog(corretora + 'Requisição: getAvaregePrice = ' + json);
        return JSON.parse(json);
    },

    getVariationPercent: function(corretora, fileVariationPercent) {
        var json = util.readFileSync(fileVariationPercent);
        util.showLog(corretora + 'Requisição: getVariationPercent = ' + json);
        return JSON.parse(json);
    }
};

function getPrice(corretora, filePriceHistory, filePriceHistoryBackup, fileLastPrice, fileVariationPercent, priceNow) {
    var priceNow = priceNow;
    if (priceNow.httpResponseStatus == 200) {
        deleteBefore24H(corretora, filePriceHistory);
        util.showLog(corretora + "Bitcoin agora $: " + priceNow.httpResponseText);
        util.saveInFile(filePriceHistory, ',\n"' +
            util.getDate(0) + '" : ' +
            priceNow.httpResponseText, 'a');
        util.saveInFile(filePriceHistoryBackup, ',\n"' +
            util.getDate(0) + '" : ' +
            priceNow.httpResponseText, 'a');
        getPercentVariationLastPrice(corretora, priceNow.httpResponseText, fileLastPrice, fileVariationPercent);
        saveLastPrice(corretora, priceNow.httpResponseText, fileLastPrice);
    } else {
        util.showLog(corretora + "Não foi possível obter o valor. Response code of request: " +
            priceNow.httpResponseStatus);
    }
}

function checkVariationPrice(corretora, filePriceHistory, filePriceHistoryBackup, fileLowPrice, fileHighPrice, fileAvaregePrice) {
    var variation = '{\n' + util.readFileSync(filePriceHistory) + '\n}';

    try {
        variation = checkVariationPriceJson(JSON.parse(variation));
    } catch (error) {
        util.makeBackupFile(filePriceHistoryBackup, filePriceHistory);
        var variation = '{\n' + util.readFileSync(filePriceHistory) + '\n}';
        variation = checkVariationPriceJson(JSON.parse(variation));
    }

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
}

function saveLastPrice(corretora, lastPrice, fileLastPrice) {
    util.showLog(corretora + 'Salvando o ultimo preço obtido... ' + lastPrice);
    lastPrice = '{\n' + '"lastPrice" : ' + lastPrice + '\n}';
    util.saveInFile(fileLastPrice, lastPrice, 'w');
}

function checkVariationPriceJson(json) {
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

function deleteBefore24H(corretora, file) {
    var json = JSON.parse('{\n' + util.readFileSync(file) + '\n}');
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
    util.saveInFile(file, valuesLast24H + lastLine, 'w');
    util.showLog(corretora + 'Limpeza efetuada dos registros obtidos antes de: ' + dateLasts24H);
}

function getPercentVariationLastPrice(corretora, newPrice, fileLastPrice, fileVariationPercent) {
    try {
        var json = JSON.parse(util.readFileSync(fileLastPrice));
    } catch (erro) {
        util.showLog(corretora + 'Falha ao ler o JSON.. Vou retornar um genérico com os valores atuais');
        var json = JSON.parse(util.createSimpleJsonInitial('variationPercent', newPrice));
    }
    oldPrice = 0;
    for (x in json) {
        oldPrice = json[x];
    }
    percentual = util.getVariacaoPercent(newPrice, oldPrice);
    util.showLog(corretora + 'Variação do ultimo preço: ' + percentual + '%');
    json = '{\n' + '"variationPercent" : ' + percentual + '\n}';
    util.saveInFile(fileVariationPercent, json, 'w');
}