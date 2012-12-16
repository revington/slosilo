module.exports.view = function (req, res) {
    res.render('project', {
        title: 'loading project'
    });
};
module.exports.update = function (req, res) {
    res.redirect('/project/' + req.params.uuid);
};
