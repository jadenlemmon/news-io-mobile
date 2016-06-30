'use strict';

(function(angular) {
    angular.module('snugfeed.service.feeds', ['snugfeed.service.user'])
        .service('snugfeedFeedsService', function ($http,snugfeedUserService) {

            var getFeeds = function () {
                return $http.get(__env.apiUrl+"feed?api_token="+snugfeedUserService.getApiToken());
            };

            var addFeed = function (data) {
                data.api_token = snugfeedUserService.getApiToken();
                return $http.post(__env.apiUrl+"feed", data);
            };

            var updateFeeds = function (feeds) {
                //feeds.api_token = snugfeedUserService.getApiToken();
                return $http.put(__env.apiUrl+"feeds?api_token="+snugfeedUserService.getApiToken(), feeds);
            };

            return {
                getFeeds: getFeeds,
                updateFeeds: updateFeeds,
                addFeed: addFeed
            };

        });
})(angular);