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
    req = http.IncomingMessage.prototype,
    app = module.exports = express();
req.pushMessage = function (type, foreword, text) {
    if (!this.session.messages) {
        this.session.messages = [];
    }
    this.session.messages.push({
        type: type,
        foreword: foreword,
        text: text
    });
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
        var msg = req.session.messages;
        delete req.session.messages;
        res.locals.messages = msg;
        next();
    });
    app.use(function (req, res, next) {
        req.db = req.app.get('db');
        req.slosilo = req.app.get('slosilo');
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
    app.set('view options', {
        debug: true
    });
});
// ==========================
// Public
// ==========================
app.get('/', routes.index);
app.get('/availability', function (req, res, next) {
    res.render('availability', {
        title: ''
    });
});
// register
app.get('/register', routes.register.view);
app.post('/register', routes.register.create);
// login + logout
app.get('/login', routes.login.view);
app.post('/login', routes.login.login);
app.all('/logout', function (req, res) {
    req.session.destroy(function () {
        res.redirect('/');
    });
});
// ==========================
// Only members
// ==========================

function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied';
        req.pushMessage('error', 'Access denied', 'Log in');
        res.redirect('/login');
    }
}
app.get('/dashboard', restrict, routes.dashboard);
app.get('/new', restrict, routes.viewNewProject);
app.post('/new', restrict, routes.makeNewProject);
app.get('/project/:uuid', restrict, routes.project.view);
app.post('/project/:uuid', restrict, routes.project.update);
