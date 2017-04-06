
"use strict";

var db = require('./db');
var table = 'Ropita';

function getAll(req, res, next) {
    db.get_records(table, {})
            .then(function (data) {
                res.status(200)
                        .json({
                            status: 'success',
                            data: data,
                            message: 'Todos los usuarios'
                        });
            })
            .catch(function (err) {
                res.status(err.status || 500)
                        .json({
                            status: 'error',
                            message: err.message
                        });
            });
}

function get(req, res, next) {
    db.get_record(table, {id: req.params.id})
            .then(function (data) {
                res.status(200)
                        .json({
                            status: 'success',
                            data: data,
                            message: 'Un usuario recibido'
                        });
            })
            .catch(function (err) {
                res.status(err.status || 500)
                        .json({
                            status: 'error',
                            message: err.message
                        });
            });
}

function create(req, res, next) {
    var user = {};
    for (var column in req.body) {
        if (typeof req.body[column] === 'string' || typeof req.body[column] === 'number')
            user[column] = req.body[column];
    }

    db.insert_record(table, user)
            .then(function (data) {
                res.status(200)
                        .json({
                            status: 'success',
                            data: data,
                            message: 'Un usuario creado'
                        });
            })
            .catch(function (err) {
                res.status(err.status || 500)
                        .json({
                            status: 'error',
                            message: err.message
                        });
            });
}

function edit(req, res, next) {
    var user = {id: req.body.id};
    for (var column in req.body) {
        if (typeof req.body[column] === 'string' || typeof req.body[column] === 'number')
            user[column] = req.body[column];
    }

    db.update_record(table, user)
            .then(function (data) {
                res.status(200)
                        .json({
                            status: 'success',
                            data: data,
                            message: 'Un usuario actualizado'
                        });
            })
            .catch(function (err) {
                res.status(err.status || 500)
                        .json({
                            status: 'error',
                            message: err.message
                        });
            });
}

function destroy(req, res, next) {
    db.delete_records(table, req.params)
            .then(function (data) {
                res.status(200)
                        .json({
                            status: 'success',
                            data: data,
                            message: 'Un usuario borrado'
                        });
            })
            .catch(function (err) {
                res.status(err.status || 500)
                        .json({
                            status: 'error',
                            message: err.message
                        });
            });
}

module.exports = {
    getAll: getAll,
    get: get,
    create: create,
    edit: edit,
    destroy: destroy
};