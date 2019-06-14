'use stricts';
var modules = require('./modules');

module.exports = function(apiApp) {

    apiApp.set('port', port);
    apiApp.get("/low", (req, res, next) => {
        res.json(modules.getLowPrice());
    });
    apiApp.get("/high", (req, res, next) => {
        res.json(modules.getHighPrice());
    });

    apiApp.route('/low')


};