var generalApiRequests = require('./general-operations-modules');
var apiRequest = require('../api-requests/btcTrade-api-requests');

var filePriceHistory = './db_resources/btcTrade/priceHistory.txt';
var filePriceHistoryBackup = './db_resources/btcTrade/priceHistoryBackup.txt';
var fileLowPrice = './db_resources/btcTrade/lowPrice.json';
var fileHighPrice = './db_resources/btcTrade/highPrice.json';
var fileAvaregePrice = './db_resources/btcTrade/avaregePrice.json';
var fileLastPrice = './db_resources/btcTrade/lastPrice.json';
var fileVariationPercent = './db_resources/btcTrade/variationPercent.json';
var corretora = "BtcTrade - ";

module.exports = {

    getPrice: function() {
        generalApiRequests.getPrice(corretora, filePriceHistory, filePriceHistoryBackup, fileLastPrice, fileVariationPercent, apiRequest.getPrice());
    },

    checkVariationPrice: function() {
        generalApiRequests.checkVariationPrice(corretora, filePriceHistory, filePriceHistoryBackup, fileLowPrice, fileHighPrice, fileAvaregePrice);
    },

    getLowPrice: function() {
        return generalApiRequests.getLowPrice(corretora, fileLowPrice);
    },

    getHighPrice: function() {
        return generalApiRequests.getHighPrice(corretora, fileHighPrice);
    },

    getLastPrice: function() {
        return generalApiRequests.getLastPrice(corretora, fileLastPrice);
    },

    getAvaregePrice: function() {
        return generalApiRequests.getAvaregePrice(corretora, fileAvaregePrice)
    },

    getVariationPercent: function() {
        return generalApiRequests.getVariationPercent(corretora, fileVariationPercent);
    },
};