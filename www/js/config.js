'use strict';

(function(){

    var __env = {};

    if(window){
        Object.assign(__env, window.__env);
    }

    var env = angular.module('env', []);
    env.constant('__env', __env);

    angular.module('app', ['ngRoute', 'env', 'ngAnimate', 'ngSanitize'])

    .service('APIInterceptor', ['$injector', function($injector) {
        var service = this;
        service.request = function(config) {
            var snugfeedUserService = $injector.get('snugfeedUserService');
            var token = snugfeedUserService.getApiToken();
            if(config.url.indexOf('api/v1') > 0 && token) {
                config.headers.Authorization = 'Bearer '+token;
            }
            return config;
        };
        service.responseError = function(response) {
            return response;
        };
    }])

    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {

        $httpProvider.interceptors.push('APIInterceptor');

        $routeProvider
            .when('/', {
                templateUrl : 'views/welcome.html',
                controller  : 'welcomeController',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl : 'views/login.html',
                controller  : 'loginController'
            })
            .when('/register', {
                templateUrl : 'views/register.html',
                controller  : 'registerController',
                controllerAs: 'vm'
            })
            .when('/feeds', {
                templateUrl: 'views/feeds.html',
                controller: 'mainController'
            })
            .when('/add-feeds', {
                templateUrl: 'views/manage-feeds.html',
                controller: 'addFeedsController',
                controllerAs: 'vm'
            });
    }]);

})();