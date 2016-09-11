'use strict';

(function() {
    angular.module('app')
        .service('snugfeedUserService', ['$http', '$q', '$timeout', '__env', function($http,$q,$timeout,__env) {

            //var api_token = localStorage.getItem('api_token') || '';

            var setApiToken = function(token) {
                localStorage.setItem('api_token', token);
                //api_token = token;
            };

            var getApiToken = function() {
                return localStorage.getItem('api_token') || false;
            };

            var loginUser = function (login) {
                return $http.post(__env.apiUrl+'user/login', login);
            };

            var logoutUser = function() {
                var deferred = $q.defer();
                localStorage.removeItem('api_token');
                //api_token = '';
                $timeout(function() {
                    deferred.resolve();
                },500);
                return deferred.promise;
            };

            var registerUser = function (register) {
                return $http.post(__env.apiUrl+'user/register', register);
            };

            var getUserStatus = function () {
                return $http.get(__env.apiUrl+'user/status');
            };

            return {
                loginUser: loginUser,
                registerUser: registerUser,
                getUserStatus: getUserStatus,
                setApiToken: setApiToken,
                getApiToken: getApiToken,
                //api_token: api_token,
                logoutUser: logoutUser
            };

        }]);
})();