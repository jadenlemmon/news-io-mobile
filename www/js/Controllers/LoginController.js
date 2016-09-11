'use strict';

(function(){

    angular.module('app').controller('loginController', ['$scope','snugfeedUserService', '$location', loginController]);

    function loginController($scope,snugfeedUserService,$location) {

        $scope.error = false;

        if(snugfeedUserService.getApiToken()) {
            $location.path( "/feeds" );
        }

        $scope.submitLogin = function($event,login) {
            $event.preventDefault();
            snugfeedUserService.loginUser(login).then(function(resp) {
                if(resp.data.api_token) {
                    snugfeedUserService.setApiToken(resp.data.api_token);
                    $location.path( "/feeds" );
                }
                else {
                    $scope.error = true;
                }
            },function() {
                $scope.error = true;
            });
        }
    }

})();