'use strict';

(function(angular) {
    function readArticleController($scope, $element, $attrs, $sce) {
        $scope.toTrustedHTML = function( html ){
            return $sce.trustAsHtml( html );
        };
    }

    angular.module('readarticlecomponent', ['ngSanitize']).component('readarticlecomponent', {
        controller: readArticleController,
        bindings: {article: '='},
        template: '' +
        '<h2>{{$ctrl.article.article_title}}</h2>' +
        '<p ng-if="$ctrl.article.article_img"><img ng-src="{{$ctrl.article.article_img}}"></p>' +
        '<p ng-bind-html="toTrustedHTML($ctrl.article.article_description)"></p>'
    });
})(angular);
