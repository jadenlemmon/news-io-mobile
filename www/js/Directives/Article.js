'use strict';

(function() {
    angular.module('app').directive('article', ['$sce', '$timeout', 'snugfeedArticlesService', function($sce,$timeout,snugfeedArticlesService) {

        function link(scope, element, attrs) {

            scope.saved = false;
            scope.saving = false;

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
                scope.saving = true;
                snugfeedArticlesService.saveArticle(article.id).then(function() {
                    scope.saved = true;
                    scope.saving = false;
                });
            };

            scope.deleteArticle = function(article) {
                scope.saving = true;
                snugfeedArticlesService.deleteArticle(article.id).then(function() {
                    scope.saving = false;
                    $timeout(function() { //weird but had to do this to run on next digest
                        scope.$emit('article deleted', article);
                    })
                });
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
            scope: {article: '=article', view: '=view', showSaved: '=saved'},
            template: '' +
            '<div class="actions">' +
            '<div class="ui tiny active inline loader" ng-show="saving"></div>' +
            '<i class="checkmark icon" ng-show="saved"></i>' +
            '<i ng-click="saveArticle(article)" ng-show="!saved && !saving && !showSaved" class="save icon pointer"></i>' +
            '<i ng-click="deleteArticle(article)" ng-show="showSaved && !saving" class="trash icon pointer"></i>' +
            '</div>' +
            '<div class="icon" ng-if="!view">' +
            '<img ng-src="{{favicon}}">' +
            '</div>' +
            '<h2 class="ui header" ng-if="!view" ng-click="readMore($event,article)">{{article.article_title}}</h2>' +
            '<p class="ui header" ng-if="view" ng-click="readMore($event,article)">{{article.article_title}}</p>' +
            '<p ng-if="article.article_img && !view"><img ng-src="{{article.article_img}}"></p>' +
            '<p ng-bind-html="parseDate(article.created_at)" ng-if="!view"></p>' +
            '<p ng-bind-html="toTrustedHTML(article.article_description)" ng-if="!view"></p>' +
            '<p><a href="#" ng-click="readMore($event,article)">Read More</a></p>'
        };
    }]);
})();