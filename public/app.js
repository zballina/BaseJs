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

'use strict';
var app = angular.module('base.fballina', []);

app.controller('UsersController', ['$scope', '$http',
    function ($scope, $http) {
        $scope.get = function () {
            $http({
                method: 'GET',
                url: '/api/usuarios'
            }).then(function (response) {
                $scope.users = response.data.data;
            }).catch(function (err) {
                alert(err.data.message);
            });
        };

        $scope.create = function (user) {
            $http({
                method: 'POST',
                url: '/api/usuarios',
                data: user
            }).then(function (response) {
                $scope.get();
                alert(response.data.message);
            }).catch(function (err) {
                alert(err.data.message);
            });
        };

        $scope.remove = function (user) {
            $http({
                method: 'DELETE',
                url: '/api/usuarios/' + user.id
            }).then(function (response) {
                $scope.get();
                alert(response.data.message);
            }).catch(function (err) {
                alert(err.data.message);
            });
        };
    }]);