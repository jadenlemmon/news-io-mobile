'use strict';

(function(){

    angular.module('app').controller('mainController', ['$scope', 'snugfeedArticlesService', 'snugfeedUserService', 'snugfeedFeedsService', mainController]);

    function mainController($scope,snugfeedArticlesService,snugfeedUserService,snugfeedFeedsService) {
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
        $scope.noFeeds = false;

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
                    if(resp.data.length > 0) {
                        $scope.lastFeedID = resp.data[resp.data.length - 1].id;
                        $scope.noFeeds = false;
                    }
                    else {
                        $scope.noFeeds = true; //they dont have feeds
                    }
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
                //$scope.user.initials = snug.generateAvatarInitials($scope.user.name);
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

    }

})();