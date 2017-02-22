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

var connection = require('./connection');

function get_records_sql(sql, params) {
    return new Promise(function (resolve, reject) {
        connection.db.any(sql, params)
                .then(function (data) {
                    resolve(data);
                })
                .catch(function (err) {
                    reject(err);
                });
    });
}

function get_records_select(table, select, params, sort, fields) {
    if (table === undefined) {
        throw new Error('Debe especificar el nombre de una tabla');
    }
    if (fields !== undefined) {
        fields = fields.length === 0 ? '*' : fields;
    } else {
        fields = '*';
    }
    var sql = 'select ' + fields + ' from ' + table;
    if (select !== undefined) {
        sql += select.length > 0 ? ' where ' + select : '';
    }
    if (sort !== undefined) {
        sql += sort.length > 0 ? ' order by ' + sort : '';
    }

    return get_records_sql(sql, params);
}

function where_clause(conditions) {
    var select = '';
    var length = Object.keys(conditions).length;
    var count = 0;
    Object.keys(conditions).forEach(function (key) {
        select += key + ' = ${' + key + '}';
        count++;
        if (count < length)
            select += ' and ';
    });

    return select;
}

function get_records(table, conditions, sort, fields) {
    var select = where_clause(conditions);
    return get_records_select(table, select, conditions, sort, fields);
}

function count_records(table, conditions) {
    var select = where_clause(conditions);

    return count_records_select(table, select, conditions);
}

function count_records_select(table, select, params) {
    if (table === undefined) {
        throw new Error('Debe especificar el nombre de una tabla');
    }
    var sql = 'select count(*) as count from ' + table;
    if (select !== undefined) {
        sql += select.length > 0 ? ' where ' + select : '';
    }

    return count_records_sql(sql, params);
}

function count_records_sql(sql, params) {
    return new Promise(function (resolve, reject) {
        connection.db.one(sql, params)
                .then(function (count) {
                    resolve(count.count);
                })
                .catch(function (err) {
                    reject(err);
                });
    });
}

function get_record(table, conditions, fields) {
    var select = where_clause(conditions);

    return get_record_select(table, select, conditions, fields);
}

function get_record_select(table, select, params, fields) {
    if (table === undefined) {
        throw new Error('Debe especificar el nombre de una tabla');
    }
    if (fields !== undefined) {
        fields = fields.length === 0 ? '*' : fields;
    } else {
        fields = '*';
    }
    var sql = 'select ' + fields + ' from ' + table;
    if (select !== undefined) {
        sql += select.length > 0 ? ' where ' + select : '';
    }

    return get_record_sql(sql, params);
}

function get_record_sql(sql, params) {
    return new Promise(function (resolve, reject) {
        connection.db.one(sql, params)
                .then(function (data) {
                    resolve(data);
                })
                .catch(function (err) {
                    reject(err);
                });
    });
}

function record_exists(table, conditions) {
    var select = where_clause(conditions);

    return record_exists_select(table, select, conditions);
}

function record_exists_select(table, select, params) {
    return new Promise(function (resolve, reject) {
        count_records_select(table, select, params)
                .then(function (count) {
                    resolve(count > 0 ? true : false);
                })
                .catch(function (err) {
                    reject(err);
                });
    });

}

function delete_records(table, conditions) {
    var select = where_clause(conditions);

    return delete_records_select(table, select, conditions);
}

function delete_records_select(table, select, params) {
    if (table === undefined) {
        throw new Error('Debe especificar el nombre de una tabla');
    }
    var sql = 'delete from ' + table;
    if (select !== undefined) {
        sql += select.length > 0 ? ' where ' + select : '';
    }
    return new Promise(function (resolve, reject) {
        connection.db.result(sql, params)
                .then(function (result) {
                    resolve(result.rowCount);
                })
                .catch(function (err) {
                    reject(err);
                });
    });
}

function fields_insert_into(params) {
    var fields = '';
    var length = Object.keys(params).length;
    var count = 0;
    Object.keys(params).forEach(function (key) {
        fields += key;
        count++;
        if (count < length)
            fields += ', ';
    });

    return fields;
}

function _fields_insert_values(params) {
    var values = '';
    var length = Object.keys(params).length;
    var count = 0;
    Object.keys(params).forEach(function (key) {
        values += '${' + key + '}';
        count++;
        if (count < length)
            values += ', ';
    });

    return values;
}

function get_sql_insert(table, record, notreturning) {
    var fields = fields_insert_into(record);
    var values = _fields_insert_values(record);
    var sql = 'insert into ' + table + '(' + fields + ')\n\
               values(' + values + ') ' + (notreturning ? '' : 'returning id');

    return sql;
}

function insert_record(table, record) {
    var sql = get_sql_insert(table, record);

    return insert_record_raw(sql, record, table);
}

function insert_record_raw(sql, record, table) {
    return new Promise(function (resolve, reject) {
        connection.db.task(function (t) {
            return t.one(sql, record)
                    .then(function (data) {
                        return t.one('select * from ' + table + ' where id = ${id}', {id: data.id});
                    });
        }).then(function (events) {
            resolve(events);
        }).catch(function (err) {
            console.log(sql);
            console.log(err);
            reject(err);
        });
    });
}

function _fields_update(params) {
    var values = '';
    var length = Object.keys(params).length;
    var count = 0;
    Object.keys(params).forEach(function (key) {
        values += key + ' = ${' + key + '}';
        count++;
        if (count < length)
            values += ', ';
    });

    return values;
}

function get_sql_update(table, record) {
    var values = _fields_update(record);
    return 'update ' + table + '\n\
               set ' + values + '\n\
               where id = ${id}';
}

function update_record(table, record) {
    var sql = get_sql_update(table, record);
    return update_record_raw(sql, record);
}

function update_record_raw(sql, record) {
    return new Promise(function (resolve, reject) {
        connection.db.none(sql, record)
                .then(function () {
                    resolve(true);
                })
                .catch(function (err) {
                    console.log(err);
                    console.log(sql);
                    reject(err);
                });
    });
}

module.exports = {
    get_record: get_record,
    get_record_select: get_record_select,
    get_record_sql: get_record_sql,
    get_records: get_records,
    get_records_select: get_records_select,
    get_records_sql: get_records_sql,
    count_records: count_records,
    count_records_select: count_records_select,
    count_records_sql: count_records_sql,
    record_exists: record_exists,
    record_exists_select: record_exists_select,
    delete_records: delete_records,
    delete_records_select: delete_records_select,
    update_record: update_record,
    update_record_raw: update_record_raw,
    insert_record: insert_record,
    insert_record_raw: insert_record_raw,
    get_sql_update: get_sql_update,
    get_sql_insert: get_sql_insert
};
