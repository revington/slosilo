var ElasticSearchClient = require('elasticsearchclient'),
    serverOptions = {
        host: 'localhost',
        port: 9200
    },
    client = new ElasticSearchClient(serverOptions);

function search(req, res, next) {
    if (!req.query.q) {
        return next();
    }
    var query = {
        query: {
            text: {
                name: req.query.q
            }
        }
    },
        buffer = [];
    var s = client.search('slosilo-test', 'slosilo-test', query);
    s.on('data', function (data) {
        buffer.push(data);
    });
    s.on('done', function () {
        var c, partial = JSON.parse(buffer.join()),
            ret = [],
            i = partial.hits.total;
        while (i--) {
            c = partial.hits.hits[i]._source;
            console.log(c);
            ret.push({
                name: c.name,
                type: c.type
            });
        }
        res.locals.searchResults = ret;
        next();
    });
    s.on('error', function (err) {
        console.err(err);
        console.trace(err.stack);
        next();
    });
    s.exec();
}

function typeahead(req, res) {
    res.json(res.locals.searchResults);
}
module.exports.typeahead = [search, typeahead];
module.exports.index = [search, function (req, res) {
    res.render('search', {
        title: 'search',disableSearch : true
    });
}];
