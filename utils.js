module.exports = {

    showLog: function(msg) {
        console.log(msg);
        this.saveInFile('log.txt', '\n' + this.getDate(0) + ' - ' + msg, 'a');
    },

    saveInFile: function(file, msg, flag) {
        var fs = require('fs')
        fs.writeFile(file, msg, {
            'flag': flag
        }, function(err) {
            if (err) {
                console.log('Erro ao salvar o arquivo...' + err);
                return console.error(err);
            }
        });
    },

    readFile: function(file) {
        var fs = require('fs');
        fs.readFileSync(process.cwd() + "\\" + file, function(err, data) {
            if (err) {
                console.log('Erro ao Ler o arquivo assync...' + err);
                console.log(err)
            } else
            //var dataFile = data.toString();
            //console.log(dataFile);
                return data;
        });
    },

    readFileSync: function(file) {
        var fs = require('fs');
        var dataFile = fs.readFileSync(file, 'utf8')
        return dataFile;
    },

    getDate: function(offset) {
        var dateTime = require('node-datetime');
        var dt = dateTime.create();
        dt.offsetInDays(offset);
        return dt.format('Y-m-d H:M:S');
    },

    getVariacaoPercent: function(newPrice, oldPrice) {
        delta = newPrice - oldPrice;
        percentual = (delta * 100) / oldPrice;
        return percentual.toFixed(2);

    }
};

//module.exports.getVariacaoPercent(1000, 1100);