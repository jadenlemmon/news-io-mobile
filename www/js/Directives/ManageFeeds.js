'use strict';

(function() {
    angular.module('app').directive('managefeedscomponent', ['snugfeedFeedsService', function(snugfeedFeedsService) {

        function link(scope, element, attrs) {

            function init() {
                snugfeedFeedsService.getFeeds().then(function(data) {
                    scope.feeds = data.data;
                });
            }
            init();

            scope.activateFeed = function(feed) {
                feed.active = feed.active ? false : true;
                scope.data = scope.feeds;
                scope.$emit('update user feeds', scope.data);
            };

            scope.$on('reload manage feeds', function() {
                init();
            });
        }
        return {
            link: link,
            restrict: 'E',
            scope: {},
            template: '' +
            '<div class="ui segment" id="manage-feeds-component">' +
            '<div class="ui eight column grid">' +
            '<div class="column" ng-repeat="feed in feeds" ng-click="activateFeed(feed)" ng-class="{\'active\': feed.active}">' +
            '<div class="overlay" ng-show="feed.active">' +
            '<i class="checkmark icon"></i>' +
            '</div>' +
            '<img ng-src="{{feed.favicon_url}}">' +
            '</div>' +
            '</div>' +
            '</div>'
        };
    }]);
})();
