function expose(req, res, next) {
    req.db = req.app.get('db');
    req.slosilo = req.app.get('slosilo');
    next();
}
var pushMessage = function (req, type, foreword, text) {
  if (!req.session.messages) {
      req.session.messages = [];
  }
  req.session.messages.push({
      type: type,
      foreword: foreword,
      text: text
  });
};
var flushMessages = function (req) {
  var ret = req.session.messages;
  delete req.session.messages;
  return ret;
};

function loadUserFromForm(req, res, next) {
    req.user = {
        type: 'user',
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        emailVerified: false,
        created_at: new Date().getTime()
    };
    next();
}

function validateNewUser(req, res, next) {
    req.slosilo.validateNewUser(req.user, function (err, msg) {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (msg && msg.length) {
            pushMessage(req, 'error', 'error', msg.join(', '));
            return res.redirect('/register');
        }
        next();
    });
}

function checkEmailIsInUse(req, res, next) {
    req.db.view('users/byEmail', {
        key: req.user.email
    }, function (err, users) {
        console.log(users);
        if (err) {
            console.error(err);
            return next(err);
        }
        if (users && users.length) {
            pushMessage(req, 'error', 'error', 'email address already in use');
            return res.redirect('/register');
        }
        next();
    });
}

function hashPassword(req, res, next) {
    try {
        req.user.hashedPassword = req.slosilo.hashPassword(req.body.password);
        return next();
    } catch (err) {
        console.error(err);
        return next(err);
    }
}
exports.create = [expose, loadUserFromForm, validateNewUser, checkEmailIsInUse, hashPassword, function (req, res) {
    var successMsg = req.db.save(req.user, function (err, doc) {
        console.log(arguments);
        if (err) {
            console.error(err);
            return next(error);
        } else {
            console.log(doc);
            // TODO:emit notifications (send email and the like
            pushMessage(req, 'success', 'Welcome!', req.user.name + ' your account has been created');
            res.redirect('/dashboard');
        }
    });
}];
exports.view = function (req, res) {
    res.render('register', {
        title: 'Register',
        messages: flushMessages(req)
    });
};
