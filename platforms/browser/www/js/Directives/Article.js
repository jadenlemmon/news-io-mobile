'use strict';

(function(angular) {
    angular.module('article', ['ngSanitize']).directive('article', function($sce,$timeout) {

        function link(scope, element, attrs) {
            scope.toTrustedHTML = function( html ){
                return $sce.trustAsHtml( html );
            };

            scope.saveArticle = function(article) {
                //snugfeedArticlesService.saveArticle(article.id).then(function() {
                //    $timeout(function() { //weird but had to do this to run on next digest
                //        scope.$emit('article saved', article);
                //    })
                //});
            };

            scope.readMore = function(article) {
                scope.$emit('read article', article);
            };

            scope.parseDate = function(date) {
                return snug.parseDate(date);
            }
        }

        return {
            link: link,
            restrict: 'E',
            scope: {article: '=article', view: '=view'},
            template: '' +
            '<div class="actions">' +
            '<i ng-click="saveArticle(article)" class="save icon pointer"></i>' +
            '</div>' +
            '<div class="icon" ng-if="!view">' +
            '<img ng-if="article.icon_name" ng-src="https://s3-us-west-2.amazonaws.com/news-io/icons/{{article.icon_name}}.png">' +
            '</div>' +
            '<h2 class="ui header" ng-if="!view">{{article.article_title}}</h2>' +
            '<p class="ui header" ng-if="view">{{article.article_title}}</p>' +
            '<p ng-bind-html="parseDate(article.created_at)" ng-if="!view"></p>' +
            '<p ng-bind-html="toTrustedHTML(article.article_description)" ng-if="!view"></p>' +
            '<p><a href="#" ng-click="readMore(article)">Read More</a></p>'
        };
    });
})(angular);