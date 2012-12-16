/* 
 * Database initialization
 */
var cradle = require('cradle');
module.exports = function (conf, docs, cb) {
    var db = new cradle.Connection(conf.url, conf.port, conf.options).database(conf.database);
    var putDocs = function () {
            console.log('Installing views');
            db.save('_design/users', {
                byEmail: {
                    map: function (doc) {
                        if (doc.type === 'user') {
                            emit(doc.email, null);
                        }
                    }
                },
                byCompany: {
                    map: function (doc) {
                        if (doc.type === 'company') {
                            for (var i in doc.people) {
                                emit(doc._id, {
                                    _id: doc.people[i].user_id
                                });
                            }
                        }
                    }
                }
            });
            db.save('_design/projects', {
                byUser: {
                    map: function (doc) {
                        if (doc.type === 'project') {
                            emit(doc.owner, doc._id);
                        }
                    }
                }
            });
            if (docs) {
                db.save(docs, cb);
            } else if (cb) {
                cb();
            }
        };
    db.exists(function (err, exists) {
        if (err) {
            console.log('error', err);
        } else if (exists) {
            console.log('cleaning existing db');
            db.destroy(function () {
                console.log('Creating db');
                db.create(function () {
                    putDocs();
                });
            });
        } else {
            console.log('database does not exists.');
            console.log('Creating db');
            db.create(putDocs, function () {
                putDoct();
            });
        }
    });
};
