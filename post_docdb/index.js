var config = require('./config.js');
var DocumentDBClient = require('documentdb').DocumentClient;
var dbUtils = require('./docDbUtils.js');
var http = require('http');
var https = require('https');
var querystring = require('querystring');
var fs = require('fs');

var docDbClient = new DocumentDBClient(config.host, {
  masterKey: config.authKey
});

module.exports = function (context, data) {
  context.log(JSON.stringify(config));
  context.log(JSON.stringify(data));
  context.client = docDbClient;
  context.config = config;

  // Call ML API
  var dataString = JSON.stringify(data);
  var host = 'ussouthcentral.services.azureml.net';
  var path = '/workspaces/path';
  var method = 'POST';
  var api_key = config.AZML_API_KEY;
  var headers = {'Content-Type':'application/json', 'Authorization':'Bearer ' + api_key};

  var options = {
    host: host,
    port: 443,
    path: path,
    method: 'POST',
    headers: headers
  };

  context.log(JSON.stringify(options));

  // Example Data shape for req/res in models/req-res_data.json
  var mlData = '';

  var req = https.request(options, (res) => {
    context.log('statusCode:', res.statusCode);
    context.log('headers:', res.headers);
    res.setEncoding('utf8');

    res.on('data', (d) => {
      mlData += d;
    });

    res.on('end', () => {
      context.log('\n' + mlData + '\n');
      var reqData = JSON.stringify(mlData);
      
      // Write Doc to docDbClient and return 
      dbUtils.addItem(context, reqData, function(err) {
            if (err) {
                context.log('docdb error: ' + err);
                context.res = {
                    status: 500,
                    body: err
                };
                context.done();
            } else {
                context.log("DocDB write success");
                context.res = {
                  body: { greeting: 'Success' }
                };
                context.done();
            }
        });
    });
  });

  req.write(dataString);
  req.end();

  req.on('error', (e) => {
    context.log('req ML error: ' + e);
    context.done();
  });
}
