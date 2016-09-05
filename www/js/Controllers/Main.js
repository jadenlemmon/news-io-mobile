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
            $location.path('add-feeds');
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
            }
            else {
                getArticles(false);
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

        function getArticles(page) {
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
            getArticles(true);
        };

        var pullLoading = function() {
            return new Promise( function( resolve, reject ) {
                getArticles(false).then(function() {
                    resolve();
                }, function() {
                    reject();
                });
            } );
        };

        function initArticleSwipe() {
            var options = {
                distance: 0,
                resistance: 1.5,
                ele: document.getElementById('read-article')
            };

            var hammertime = new Hammer(options.ele);
            hammertime.get('pan').set({ direction: Hammer.DIRECTION_RIGHT });
            hammertime.on( 'panright panend panstart', _pan );

            var vertical = new Hammer(options.ele);
            vertical.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });

            // only recognize the inner pan when the outer is failing.
            // they both have a threshold of some px
            hammertime.get('pan').requireFailure(vertical.get('pan'));

            function _pan(ev) {
                options.distance = ev.distance / options.resistance;

                var threshhold = window.innerWidth * .70;

                if(Hammer.DIRECTION_HORIZONTAL) {
                    if (ev.type == 'panend' || env.type == 'pancancel') {
                        options.ele.className += ' animate';
                        options.ele.className = options.ele.className.replace('swiping', '').trim();
                        if(ev.distance > (threshhold)) {
                            options.ele.style.transform = options.ele.style.transform = 'translate3d( ' + window.innerWidth + 'px,0 ,0 )';
                            options.ele.style.transform = options.ele.style.webkitTransform = 'translate3d( ' + window.innerWidth + 'px,0 ,0 )';
                            $scope.showReadArticle = $scope.showReadArticle ? false : true;
                            $scope.$apply();
                            $timeout(function() {
                                options.ele.style.transform = options.ele.style.transform = '';
                                options.ele.style.transform = options.ele.style.webkitTransform = '';
                            },500);
                        }
                        else {
                            options.ele.style.transform = options.ele.style.transform = '';
                            options.ele.style.transform = options.ele.style.webkitTransform = '';
                        }

                    }
                    else if(ev.type == 'panright') {
                        options.ele.className = options.ele.className.replace('animate', 'swiping').trim();
                        options.ele.style.transform = options.ele.style.transform = 'translate3d( ' + options.distance + 'px,0' +
                            ' ,0 )';
                        options.ele.style.transform = options.ele.style.webkitTransform = 'translate3d( ' + options.distance + 'px,0 ,0 )';
                    }
                }

            }
        }

        getUserStatus();
        Hammer.defaults.touchAction = 'auto';
        WebPullToRefresh.init( {
            loadingFunction: pullLoading,
            contentEl: document.getElementById('feed-stream')
        } );
        initArticleSwipe();

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
        init();

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
                templateUrl: 'views/add-feeds.html',
                controller: 'addFeedsController',
                controllerAs: 'vm'
            });
    });
})(angular);

