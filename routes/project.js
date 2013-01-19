function loadProject(req, res, next) {
    req.app.get('db').get(req.params.uuid, function (err, data) {
        if (err) {
            console.error(err);
        }
        res.locals.data = data;
        return next();
    });
}
module.exports.view = [function (req, res, next) {
    res.format({
        html: function () {
            res.render('project', {
                title: 'loading project'
            });
        },
        json: function () {
            next();
        }
    });
},
loadProject, function (req, res) {
    res.json(res.locals.data);
}];
module.exports.update = function (req, res) {
    res.redirect('/project/' + req.params.uuid);
};
