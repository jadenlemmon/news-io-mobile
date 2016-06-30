'use strict';

(function(angular) {

    var __env = {};

    if(window){
        Object.assign(__env, window.__env);
    }

    var env = angular.module('env', []);
    env.constant('__env', __env);

    var app = angular.module('app', ['article', 'snugfeed.service.articles', 'snugfeed.service.user', 'ngRoute', 'env', 'ngAnimate', 'managefeedscomponent', 'snugfeed.service.feeds']);


    /**
     * Main Controller
     */
    app.controller('mainController', function($scope,$http,snugfeedArticlesService,snugfeedUserService,$location,snugfeedFeedsService) {

        $scope.articles = {};
        $scope.user = {};
        $scope.articleFilter = false;                               //toggles filtering articles
        $scope.showSaved = false;                                   //if we are showing saved articles
        $scope.showSettings = false;
        $scope.articleView = false;
        $scope.showManageFeeds = false;

        function getFeedsIds() {
            var feeds = $scope.user.feeds;
            return feeds.map(function(i) {
                return i.id;
            });
        }

        /**
         * Update user active feeds via feed service
         * @param feeds
         */
        function handleFeedUpdate(feeds) {
            feeds = feeds.filter(function(i) {
                if(i.active) return i;
            });

            snugfeedFeedsService.updateFeeds(feeds).then(function(data) {
                getUserStatus();
            });
        }

        $scope.$on('update user feeds', function(c, feeds) {
            handleFeedUpdate(feeds);
        });

        function getArticles(page) {
            var ids = $scope.articleFilter ? [$scope.articleFilter] : getFeedsIds();
            snugfeedArticlesService.getArticles(page, ids).then(function(resp) {
                console.log(resp.data);
                $scope.articles = resp.data;
                console.log($scope.user.feeds);
            });
        }

        function getUserStatus() {
            snugfeedUserService.getUserStatus().then(function(resp) {
                $scope.user = resp.data.user;
                $scope.user.initials = snug.generateAvatarInitials($scope.user.name);
                console.log($scope.user.feeds);
                getArticles(false);
            });
        }
        getUserStatus();


        /**
         * Filters articles
         * @param id
         */
        $scope.filterArticles = function(id) {
            $scope.articleFilter = id;
            getArticles(false);
            $scope.showSaved = false;
        };

        $scope.toggleSettings = function() {
            $scope.showSettings = $scope.showSettings ? false : true;
        };

        $scope.toggleView = function(toggle) {
            console.log(toggle);
            $scope.articleView = toggle;
        };

        $scope.logout = function() {
            snugfeedUserService.logoutUser().then(function() {
                $location.path('/');
            });
        };

        $scope.toggleManageFeeds = function() {
            $scope.showManageFeeds = $scope.showManageFeeds ? false : true;
        }

    })
    .controller('welcomeController', function($scope,snugfeedUserService,$location) {

        $scope.error = false;

        if(snugfeedUserService.getApiToken() !== '') {
            $location.path( "/feeds" );
        }

        $scope.submitLogin = function($event,login) {
            $event.preventDefault();
            console.log(login);
            snugfeedUserService.loginUser(login).then(function(resp) {
                snugfeedUserService.setApiToken(resp.data[0].api_token);
                $location.path( "/feeds" );
            },function() {
                $scope.error = true;
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

