'use strict';

(function(){

    angular.module('app').controller('welcomeController', ['snugfeedUserService', '$location', welcomeController]);

    function welcomeController(snugfeedUserService,$location) {

        if(snugfeedUserService.getApiToken()) {
            $location.path( "/feeds" );
        }

        var vm = this;

        vm.showLogin = function() {
            $location.path( "/login" );
        };

        vm.showRegister = function() {
            $location.path( "/register" );
        }
    }

})();