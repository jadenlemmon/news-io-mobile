'use strict';

(function(angular) {
    angular.module('article', ['ngSanitize']).directive('article', function($sce,$timeout) {

        function link(scope, element, attrs) {

            function charLimit(content) {
                if(content) {
                    content = content.split('<br>')[0];
                    content = content.split('</p>')[0];
                    if(content.length > 400) content = content.substring(0,400)+'...';
                    return content;
                }
                return '';
            }

            scope.toTrustedHTML = function( html ){
                //charLimit(html);
                return $sce.trustAsHtml( charLimit(html) );
            };

            scope.saveArticle = function(article) {
                //snugfeedArticlesService.saveArticle(article.id).then(function() {
                //    $timeout(function() { //weird but had to do this to run on next digest
                //        scope.$emit('article saved', article);
                //    })
                //});
            };

            scope.readMore = function($event, article) {
                $event.preventDefault();
                scope.$emit('read article', article);
            };

            scope.parseDate = function(date) {
                return 'Added '+snug.timePassed(date);
            };

            scope.favicon = getFavicon(scope.article.feed_id);

            function getFavicon(id) {
                if(scope.$parent.user.feeds && id) {
                    var arr = _.find(scope.$parent.user.feeds, function(feed){ return feed.id == id });
                    return arr.favicon_url;
                }
                return '';
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
            '<img ng-src="{{favicon}}">' +
            '</div>' +
            '<h2 class="ui header" ng-if="!view">{{article.article_title}}</h2>' +
            '<p class="ui header" ng-if="view">{{article.article_title}}</p>' +
            '<p ng-bind-html="parseDate(article.created_at)" ng-if="!view"></p>' +
            '<p ng-bind-html="toTrustedHTML(article.article_description)" ng-if="!view"></p>' +
            '<p><a href="#" ng-click="readMore($event,article)">Read More</a></p>'
        };
    });
})(angular);