exports.index = function (req, res) {
    res.render('index', {
        title: 'Express'
    });
};
exports.dashboard = function (req, res) {
    res.render('dashboard', {
        title: 'Dashboard'
    });
};
exports.register = require('./register');
exports.login = require('./login');
exports.newProject = function (req, res) {
    res.render('new', {
        title: '*New project*'
    });
};

