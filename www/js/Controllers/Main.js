'use strict';

(function(angular) {

    var __env = {};

    if(window){
        Object.assign(__env, window.__env);
    }

    var env = angular.module('env', []);
    env.constant('__env', __env);

    var app = angular.module('app', ['article', 'snugfeed.service.articles', 'snugfeed.service.user', 'ngRoute', 'env', 'ngAnimate', 'managefeedscomponent', 'snugfeed.service.feeds', 'readarticlecomponent', 'feeddropdowncomponent']);

    /**
     * Global Controller
     */
    app.controller('globalController', function($scope,$location,snugfeedUserService,$timeout) {

        $scope.toggleSettings = function() {
            $('.ui.sidebar').sidebar('toggle');
        };

        $scope.showAddFeeds = function() {
            $location.path('manage-feeds');
            $scope.toggleSettings();
        };

        $scope.logout = function() {
            snugfeedUserService.logoutUser().then(function() {
                $location.path('/');
            });
        };
    })
    /**
     * Feeds Controller
     */
    .controller('mainController', function($scope,$http,snugfeedArticlesService,snugfeedUserService,$location,snugfeedFeedsService,$timeout) {

        $scope.articles = [];
        $scope.user = {};
        $scope.articleFilter = false;                               //toggles filtering articles
        $scope.showSaved = false;                                   //if we are showing saved articles
        $scope.showSettings = false;
        $scope.articleView = false;
        $scope.showManageFeeds = false;
        $scope.articleToRead = {};
        $scope.showReadArticle = false;
        $scope.lastFeedID = 0;
        $scope.loading = true;

        function getFeedsIds() {
            var feeds = $scope.user.feeds;
            return feeds.map(function(i) {
                return i.id;
            });
        }

        function filterArticles(id) {
            $scope.articles = [];
            $scope.articleFilter = id !== 0 ? [id] : false;

            if(id == 'saved') {
                getSavedArticles();
                $scope.showSaved = true;
            }
            else {
                getArticles(false, true);
                $scope.showSaved = false;
            }
        }

        /**
         * Get's all articles saved by the user
         */
        function getSavedArticles() {
            snugfeedArticlesService.getSavedArticles().then(function(resp) {
                $scope.articles = resp.data;
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

        $scope.$on('feed selected', function(e, value) {
            filterArticles(value);
        });

        $scope.$on('read article', function(c, article) {
            $scope.articleToRead = article;
            $scope.toggleReadArticle();
        });

        $scope.$on('article deleted', function(c,article) {
            var arr = $scope.articles;
            arr = _.filter(arr, function(item) {
                return item.id !== article.id;
            });
            $scope.articles = arr;
        });

        function getArticles(page, loading) {
            $scope.loading = loading;
            page = page ? $scope.lastFeedID : false;

            var ids = parseInt($scope.articleFilter) ? [$scope.articleFilter] : getFeedsIds();

            return new Promise( function( resolve, reject ) {

                snugfeedArticlesService.getArticles(page, ids).then(function (resp) {
                    if (page && resp.data.length > 0) {
                        $scope.articles = $scope.articles.concat(resp.data);
                    }
                    else {
                        $scope.articles = resp.data;
                    }
                    $scope.lastFeedID = resp.data[resp.data.length - 1].id;
                    resolve(resp.data);
                    $scope.loading = false;
                },function(error) {
                    reject(error);
                });

            });
        }

        function getUserStatus() {
            snugfeedUserService.getUserStatus().then(function(resp) {
                $scope.user = resp.data.user;
                $scope.user.initials = snug.generateAvatarInitials($scope.user.name);
                getArticles(false);
            });
        }

        $scope.toggleView = function(toggle) {
            $scope.articleView = toggle;
        };

        $scope.toggleReadArticle = function() {
            $scope.showReadArticle = !$scope.showReadArticle;
        };

        $scope.getMoreArticles = function() {
            getArticles(true, true);
        };

        //on load
        getUserStatus();
        Hammer.defaults.touchAction = 'auto';
        WebPullToRefresh.init( {
            loadingFunction: function() {
                return new Promise( function( resolve, reject ) {
                    getArticles(false, false).then(function() {
                        resolve();
                    }, function() {
                        reject();
                    });
                } );
            },
            contentEl: document.getElementById('feed-stream')
        } );

        Swipe.init({
            finish: function() {
                $scope.toggleReadArticle();
                $scope.$apply();
            }
        });

    })
    .controller('welcomeController', function($scope,snugfeedUserService,$location) {

        $scope.error = false;

        if(snugfeedUserService.getApiToken() !== '') {
            $location.path( "/feeds" );
        }

        $scope.submitLogin = function($event,login) {
            $event.preventDefault();
            snugfeedUserService.loginUser(login).then(function(resp) {
                snugfeedUserService.setApiToken(resp.data[0].api_token);
                $location.path( "/feeds" );
            },function() {
                $scope.error = true;
            });
        }
    })
    .controller('addFeedsController', function($scope,$location,snugfeedUserService,snugfeedFeedsService) {

        var vm = this;
        vm.feeds = [];
        vm.userFeeds = [];
        vm.loading = false;

        if(snugfeedUserService.getApiToken() == '') {
            $location.path( "/" );
        }

        function searchTerm(term) {
            vm.loading = true;
            snugfeedFeedsService.searchForFeed(term).then(function(resp) {
                vm.feeds = resp.data;
                vm.loading = false;
            });
        }

        function init() {
            snugfeedFeedsService.getFeeds().then(function(resp) {
                vm.feeds = resp.data.data;
            });
        }

        function getUserFeeds() {
            snugfeedUserService.getUserStatus().then(function(resp) {
                vm.userFeeds = resp.data.user.feeds;
            });
        }

        getUserFeeds();
        init();
        $('.tabs.menu .item').tab({
            onLoad: function(tab) {
                if(tab == 'add') {
                    init();
                }
                else {
                    getUserFeeds();
                }
            }
        });

        vm.search = function(term) {
            if(term.length > 3) searchTerm(term);
        };

        vm.add = function($index, feedID) {

            if(vm.feeds[$index].added) return;

            vm.feeds[$index].loading = true;

            snugfeedFeedsService.addFeed({feed_id: feedID}).then(function(resp) {
                vm.feeds[$index].loading = false;
                if(resp.data.status == 'success') {
                    vm.feeds[$index].added = true;
                    vm.feeds[$index].btnText = ' ';
                }

            });
        };

        vm.remove = function($index, feedID) {

            vm.userFeeds[$index].loading = true;

            snugfeedFeedsService.removeFeed(feedID).then(function(resp) {
                vm.userFeeds[$index].loading = false;
                if(resp.data.status == 'success') {
                    vm.userFeeds[$index].removed = true;
                    vm.userFeeds[$index].btnText = 'Removed';
                }
            })
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
            })
            .when('/add-feeds', {
                templateUrl: 'views/manage-feeds.html',
                controller: 'addFeedsController',
                controllerAs: 'vm'
            });
    });
})(angular);

