#!/usr/local/bin/node

var app = require('./app'),
    http = require('http');
process.on('uncaughtException', function (err) {
    console.error('uncaughtException', err.message);
    console.error(err.stack);
    process.exit(1);
});
http.createServer(app).listen(app.get('port'), function () {
    console.log("ŝlosilo listening on port %d in %s mode", app.get('port'), app.settings.env);
});
