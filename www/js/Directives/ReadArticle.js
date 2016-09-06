'use strict';

(function(angular) {
    function readArticleController($scope, $element, $attrs, $sce) {

        var vm = this;

        $scope.toTrustedHTML = function( html ){
            return $sce.trustAsHtml( html );
        };

        vm.openSite = function(link) {
            var ref = window.open(link, '_system', 'location=no');
        }
    }

    angular.module('readarticlecomponent', ['ngSanitize']).component('readarticlecomponent', {
        controller: readArticleController,
        bindings: {article: '='},
        template: '' +
        '<button class="mini ui button" ng-click="$ctrl.openSite($ctrl.article.article_link)">' +
        'Open Full Article ' +
        '</button>' +
        '<h2>{{$ctrl.article.article_title}}</h2>' +
        '<p ng-if="$ctrl.article.article_img"><img ng-src="{{$ctrl.article.article_img}}"></p>' +
        '<p ng-bind-html="toTrustedHTML($ctrl.article.article_description)"></p>'
    });
})(angular);
