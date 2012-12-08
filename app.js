/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    Slosilo = require('./index'),
    slosilo = new Slosilo(),
    cradle = require('cradle'),
    conf = null,
    app = module.exports = express();
var pushMessage = function (req, type, foreword, text) {
        if (!req.messages) {
            req.messages = [];
        }
        req.messages.push({
            type: type,
            foreword: foreword,
            text: text
        });
    };
var flushMessages = function (req) {
        var ret = req.messages;
        delete req.messages;
        return ret;
    };
app.configure(function () {
    app.set('slosilo', slosilo);
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(function (req, res, next) {
        var err = req.session.error,
            msg = req.session.success;
        delete req.session.error;
        delete req.session.success;
        res.locals.message = '';
        if (err) {
            res.locals.messages = err;
        }
        if (msg) {
            res.locals.messages = msg;
        }
        next();
    });
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
});
app.configure('development', function () {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
    app.locals.pretty = true;
    app.set('conf', require('./couch-test-conf'));
    conf = app.get('conf');
    app.set('db', new cradle.Connection(conf.url, conf.port, conf.options).database(conf.database));
});
app.get('/', routes.index);
app.get('/availability', function (req, res, next) {
    res.render('availability', {
        title: ''
    });
});
app.get('/register', routes.register.view);
app.post('/register', routes.register.create);
