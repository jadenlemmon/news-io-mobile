'use strict';

(function(angular) {
    angular.module('snugfeed.service.user', ['env'])
        .service('snugfeedUserService', function ($http,$q,$timeout) {

            var api_token = localStorage.getItem('api_token') || '';

            var setApiToken = function(token) {
                localStorage.setItem('api_token', token);
                api_token = token;
            };

            var getApiToken = function() {
                return api_token;
            };

            var loginUser = function (login) {
                return $http.post(__env.apiUrl+'user/login', login);
            };

            var logoutUser = function() {
                var deferred = $q.defer();
                localStorage.removeItem('api_token');
                api_token = '';
                $timeout(function() {
                    deferred.resolve();
                },500);
                return deferred.promise;
            };
            //
            //var registerUser = function (register) {
            //    return $http.post('/auth/register', register);
            //};

            var getUserStatus = function () {
                return $http.get(__env.apiUrl+'user/status?api_token='+api_token);
            };

            return {
                loginUser: loginUser,
                //registerUser: registerUser,
                getUserStatus: getUserStatus,
                setApiToken: setApiToken,
                getApiToken: getApiToken,
                api_token: api_token,
                logoutUser: logoutUser
            };

        });
})(angular);