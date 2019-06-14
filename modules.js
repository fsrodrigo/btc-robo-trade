var util = require('./utils');
var apiRequest = require('./api-requests');

module.exports = {

    getPrice: function() {
        var priceNow = apiRequest.getPrice();
        if (priceNow.httpResponseStatus == 200) {
            util.showLog("Bitcoin agora $: " + priceNow.httpResponseText);
            util.saveInFile('priceHistory.txt', ',\n"' +
                util.getDate() + '" : ' +
                priceNow.httpResponseText, 'a');
        } else {
            util.showLog("Não foi possível obter o valor. Response code of request: " +
                priceNow.httpResponseStatus);
        }
    },

    getVariationPrice: function() {
        var variation = '{\n' + util.readFileSync('priceHistory.txt') + '\n}';
        variation = checkVariationPrice(JSON.parse(variation));
        //util.showLog(variation);
        lowPrice = '{\n' + '"lowPrice" : ' + variation.low + '\n}';
        highPrice = '{\n' + '"highPrice" : ' + variation.high + '\n}';
        util.saveInFile('lowPrice.json', lowPrice, 'w');
        util.saveInFile('highPrice.json', highPrice, 'w');
    },

    getLowPrice: function() {
        var json = util.readFileSync('lowPrice.json');
        return JSON.parse(json);
    },

    getHighPrice: function() {
        var json = util.readFileSync('highPrice.json');

        if (isJSON(json)) {
            return JSON.parse(json);
        } else {
            this.getHighPrice;
        }
    }

};


function checkVariationPrice(json) {
    history = [];
    for (x in json) {
        history.push(json[x]);
    }
    high = Math.max(...history);
    low = Math.min(...history);
    return {
        low: low,
        high: high
    };
}

function isJSON(json) {
    try {
        JSON.parse(json);
    } catch (e) {
        return false;
    }
    return true;
}