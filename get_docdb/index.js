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

module.exports = function(context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);

    // Select last record inserted
    var querySpec = {
        query: 'SELECT * FROM root r'
    };

    dbUtils.query(context, querySpec, function(err, items) {
        if (err) {
            context.log('docdb error: ' + err);
            context.res = {
                status: 500,
                body: err
            };
            context.done();
        } else {
            context.log("DocDB read success");
            context.res = {
              // return playtime from DocDB
              "Locations" : [{"name": "Las Vegas","playTime": items[0]}, {"name": "Alpharetta","playTime": items[1] } ]
            };
            context.done();
        }
    });

    context.log(context.res.body);
    context.done();
}; 
