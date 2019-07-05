var generalApiRequests = require('./general-operations-modules');
var apiRequest = require('../api-requests/external-api-requests');


var filePriceHistory = './db_resources/blockchain/priceHistory.txt';
var filePriceHistoryBackup = './db_resources/blockchain/priceHistoryBackup.txt';
var fileLowPrice = './db_resources/blockchain/lowPrice.json';
var fileHighPrice = './db_resources/blockchain/highPrice.json';
var fileAvaregePrice = './db_resources/blockchain/avaregePrice.json';
var fileLastPrice = './db_resources/blockchain/lastPrice.json';
var fileVariationPercent = './db_resources/blockchain/variationPercent.json';
var corretora = "Internacional - ";

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