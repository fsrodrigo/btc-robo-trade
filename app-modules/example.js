console.log("app started...")

//Instalar dependências...
//npm i bitcoin-address-generator
//npm i xmlhttprequest

function generateAddress() {
    const Bitcoin = require('bitcoin-address-generator');
    Bitcoin.createWalletAddress(response => {
        json = response;
    });
    //key = json["key"];
    //address = json["address"];
    return json;
}

function checkAddress(address) {
    theUrl = 'https://blockchain.info/balance?active=';
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl + address, false);
    xmlHttp.send(null);
    var json = JSON.parse(xmlHttp.responseText);
    //console.log(json);
    return json;
}

function validadeBalance(address, json) {
    saldo = json[address].final_balance;
    if (saldo > 0) {
        console.log("Address: " + address + " Saldo encontrado: " + saldo);
    } else
        console.log("Sem saldo!!!");
}

function myApp(turns) {
    x = 1;
    while (x != turns) {
        var wallet = generateAddress();
        console.log("Key " + x + " Generated: " + wallet["key"]);
        validadeBalance(wallet["address"], checkAddress(wallet["address"]));
        x++;
    }
}

myApp(100); //100 = Quantidade de endereços que deseja gerar.

//validadeBalance('3EENzQdQS3BvvnkeJjC5uVwUKFuTczpnok', checkAddress('3EENzQdQS3BvvnkeJjC5uVwUKFuTczpnok'));