'use strict';

(function(){

    angular.module('app').controller('welcomeController', ['snugfeedUserService', '$location', welcomeController]);

    function welcomeController(snugfeedUserService,$location) {

        //$scope.error = false;
        //
        //if(snugfeedUserService.getApiToken()) {
        //    $location.path( "/feeds" );
        //}
        //
        //$scope.submitLogin = function($event,login) {
        //    $event.preventDefault();
        //    snugfeedUserService.loginUser(login).then(function(resp) {
        //        if(resp.data.api_token) {
        //            snugfeedUserService.setApiToken(resp.data.api_token);
        //            $location.path( "/feeds" );
        //        }
        //        else {
        //            $scope.error = true;
        //        }
        //    },function() {
        //        $scope.error = true;
        //    });
        //}

        var vm = this;

        vm.showLogin = function() {
            $location.path( "/login" );
        };

        vm.showRegister = function() {
            $location.path( "/register" );
        }
    }

})();