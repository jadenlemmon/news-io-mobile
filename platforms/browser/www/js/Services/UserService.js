'use strict';

(function(angular) {
    angular.module('snugfeed.service.user', ['env'])
        .service('snugfeedUserService', [ "$http", function ($http) {

            this.api_token = '';

            var setApiToken = function(token) {
                this.api_token = token;
            }.bind(this);

            var getApiToken = function() {
                return this.api_token;
            }.bind(this);

            var loginUser = function (login) {
                return $http.post(__env.apiUrl+'user/login', login);
            };
            //
            //var registerUser = function (register) {
            //    return $http.post('/auth/register', register);
            //};

            var getUserStatus = function () {
                return $http.get(__env.apiUrl+'user/status?api_token='+this.api_token);
            }.bind(this);

            return {
                loginUser: loginUser,
                //registerUser: registerUser,
                getUserStatus: getUserStatus,
                setApiToken: setApiToken,
                getApiToken: getApiToken,
                api_token: this.api_token
            };

        }]);
})(angular);