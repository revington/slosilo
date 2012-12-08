var bcrypt = require('bcrypt');
var Slosilo = function () {};
exports = module.exports = Slosilo; /* validators */
Slosilo.prototype.validateNewUser = function (input, callback) {
    var errors = [];
    if (errors.length > 0) {
        callback(errors);
    } else {
        callback(null, true);
    }
};
Slosilo.prototype.hashPassword = function (input) {
    return bcrypt.hashSync(input, bcrypt.genSaltSync(10));
};
Slosilo.prototype.testPassword = function (hash, plain) {
    return bcrypt.compareSync(plain, hash);
};
