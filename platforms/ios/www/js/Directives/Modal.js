'use strict';

(function(angular) {
    angular.module('modal', [])
        .directive('modal', function() {
            return {
                restrict: 'E',
                transclude: true,
                scope: {
                    header: '@',
                    modalId: '@',
                    options: '='
                },
                link: function(scope, elem, attrs) {
                    scope.close = function() {
                        $('#'+scope.modalId).modal('hide');
                    };
                    scope.basic = attrs.basic ? true : false;
                    if(attrs.template) scope.template = '/js/templates/modals/' + attrs.template + '.html';
                },
                template: '' +
                '<div class="ui small modal" id="{{ modalId }}" ng-class="{\'basic\': basic}">' +
                '<div class="header"><span>{{header}}</span></div>' +
                '<div class="content">' +
                '<div ng-transclude></div>' +
                '<div ng-include="template" ng-if="template"></div>' +
                '<button class="fluid ui red button close" ng-click="close()">Close</button>' +
                '</div>' +
                '</div>'
            };
        });
})(angular);
