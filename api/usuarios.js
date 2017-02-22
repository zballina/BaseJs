/*
 * The MIT License
 *
 * Copyright 2017 Francisco Ballina<francisco@itsescarcega.edu.mx>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

"use strict";

var db = require('./db');
var table = 'usuarios';

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