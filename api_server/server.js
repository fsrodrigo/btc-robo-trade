var express = require('express');
bodyParser = require('body-parser');
//var modules = require('../app-modules/foreign-operations-modules');
var modules = require('../app-modules/btcTrade-operations-modules');


apiApp = express();
port = process.env.PORT || 3000;

apiApp.use(bodyParser.urlencoded({ extended: true }));
apiApp.use(bodyParser.json());


apiApp.get("/low", (req, res, next) => {
    res.json(modules.getLowPrice());
});

apiApp.get("/high", (req, res, next) => {
    res.json(modules.getHighPrice());
});
apiApp.get("/avarege", (req, res, next) => {
    res.json(modules.getAvaregePrice());
});
apiApp.get("/last", (req, res, next) => {
    res.json(modules.getLastPrice());
});
apiApp.get("/vPercent", (req, res, next) => {
    res.json(modules.getVariationPercent());
});
module.exports = {
    startServer: function() {
        apiApp.listen(port);
        console.log("Servidor rodando na porta " + port);
    }
}