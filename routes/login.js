/*
function expose(req, res, next) {
    req.db = req.app.get('db');
    req.slosilo = req.app.get('slosilo');
    next();
}
*/
function loadUserByEmail(req, res, next) {
    req.db.view('users/byEmail', {
        key: req.body.email,
        include_docs: true
    }, function (err, users) {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (!users || !users.length) {
            req.pushMessage('error', 'Bad login', 'bad email, password or both');
            return res.redirect('/login');
        }
        req.candidate = users[0].doc;
        return next();
    });
}

function authenticate(req, res, next) {
    console.log(req.candidate);
    if (req.app.get('slosilo').testPassword(req.candidate.hashedPassword, req.body.password)) {
        req.session.user = req.candidate;
        res.redirect('/dashboard');
    } else {
        req.pushMessage('error', 'Bad login', 'bad email, password or both');
        res.redirect('/login');
    }
}
exports.login = [ loadUserByEmail, authenticate];
exports.view = function (req, res) {
    res.render('login', {
        title: 'login'
    });
};
