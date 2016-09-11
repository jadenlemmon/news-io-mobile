'use strict';

(function(){

    angular.module('app').controller('registerController', ['snugfeedUserService', '$location', registerController]);

    function registerController(snugfeedUserService,$location) {

        var vm = this;
        vm.loading = false;

        if(snugfeedUserService.getApiToken()) {
            $location.path( "/feeds" );
        }

        function validate() {
            $('#register-form')
                .form({
                    fields: {
                        email     : 'empty',
                        name     : 'empty',
                        password : ['minLength[6]', 'empty'],
                        password_confirmation : ['minLength[6]', 'empty']
                    }
                });
        }
        validate();

        vm.registerUser = function($event,register) {
            $event.preventDefault();
            if($('#register-form').form('is valid'))
                vm.loading = true;
            snugfeedUserService.registerUser(register).then(function(resp) {
                if(resp.data.status == 'success') {
                    $location.path( "/login" );
                }
            },function(error) {
                $('#register-form').form('add errors', error.data.errors);
                vm.loading = false;
            });
        }

    }

})();