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
