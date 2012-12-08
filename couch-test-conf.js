var db = 'slosilo-test';
module.exports = {
    url: "http://localhost",
    port: 5984,
    options: {
        auth: {
            username: 'root',
            password: 'root'
        },
        cache: false,
        raw: false
    },
    database: db,
    txn: {
        timestamps: true,
        couch: "http://localhost:5984",
        db: db
    }
};
