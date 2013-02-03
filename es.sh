curl -XPUT 'localhost:9200/_river/slosilo-test/_meta' -d '{
    "type" : "couchdb",
    "couchdb" : {
        "host" : "localhost",
        "port" : 5984,
        "db" : "slosilo-test",
        "filter" : null
    },
    "index" : {
        "index" : "slosilo-test",
        "type" : "slosilo-test",
        "bulk_size" : "100",
        "bulk_timeout" : "10ms"
    }
}'
