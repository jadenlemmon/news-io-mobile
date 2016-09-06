'use strict';

(function(angular) {
    angular.module('snugfeed.service.feeds', ['env'])
        .service('snugfeedFeedsService', function ($http,__env) {

            var getFeeds = function () {
                return $http.get(__env.apiUrl+"feed");
            };

            var addFeed = function (data) {
                return $http.post(__env.apiUrl+"feed", data);
            };

            var updateFeeds = function (feeds) {
                return $http.put(__env.apiUrl+"feeds", feeds);
            };

            var searchForFeed = function(term) {
                return $http.get(__env.apiUrl+"feed?term="+term);
            };

            var removeFeed = function (id) {
                return $http.delete(__env.apiUrl+"feed/"+id);
            };

            return {
                getFeeds: getFeeds,
                updateFeeds: updateFeeds,
                addFeed: addFeed,
                searchForFeed: searchForFeed,
                removeFeed: removeFeed
            };

        });
})(angular);