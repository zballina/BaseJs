
var promise = require('bluebird');

var pgp = require('pg-promise')(
        {
            promiseLib: promise
        }
);

var cn = {
    host: 'localhost',
    port: 5432,
    database: 'ropa',
    user: 'Arthuro',
    password: 'Arthuro97.'
};

module.exports = {
    db: pgp(cn)
};