var promise = require('bluebird');

var pgp = require('pg-promise')(
        {
            promiseLib: promise
        }
);

var cn = {
    host: 'localhost',
    port: 5432,
    database: 'ant',
    user: 'pym',
    password: 'wasp'
};

module.exports = {
    db: pgp(cn)
};