'use strict';

(function(){

    angular.module('app').controller('globalController', ['$scope', '$location', 'snugfeedUserService', globalController]);

    /**
     * Global Controller
     */
    function globalController($scope,$location,snugfeedUserService) {

        $scope.toggleSettings = function() {
            $('.ui.sidebar').sidebar('toggle');
        };

        $scope.showAddFeeds = function() {
            $location.path('manage-feeds');
            $scope.toggleSettings();
        };

        $scope.logout = function() {
            snugfeedUserService.logoutUser().then(function() {
                $location.path('/');
                $scope.toggleSettings();
            });
        };
    }

})();