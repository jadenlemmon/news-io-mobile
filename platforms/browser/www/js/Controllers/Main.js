'use strict';

(function(angular) {

    var __env = {};

    if(window){
        Object.assign(__env, window.__env);
    }

    var env = angular.module('env', []);
    env.constant('__env', __env);

    var app = angular.module('app', ['article', 'snugfeed.service.articles', 'snugfeed.service.user', 'ngRoute', 'env']);


    /**
     * Main Controller
     */
    app.controller('mainController', function($scope,$http,snugfeedArticlesService,snugfeedUserService,$routeParams) {

        $scope.articles = {};
        $scope.user = {};

        snugfeedArticlesService.getArticles(false, [1,2,3]).then(function(resp) {
            $scope.articles = resp.data;
        });

        snugfeedUserService.getUserStatus().then(function(resp) {
           $scope.user = resp.data.user;
        });

    })
    .controller('welcomeController', function($scope,snugfeedUserService,$location) {
        $scope.submitLogin = function($event,login) {
            $event.preventDefault();
            console.log(login);
            snugfeedUserService.loginUser(login).then(function(resp) {
                snugfeedUserService.setApiToken(resp.data[0].api_token);
                $location.path( "/feeds" );
            });
        }
    })
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl : 'views/welcome.html',
                controller  : 'welcomeController'
            })
            .when('/feeds', {
                templateUrl: 'views/feeds.html',
                controller: 'mainController'
            });
    });
})(angular);

