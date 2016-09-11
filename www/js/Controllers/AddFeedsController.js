'use strict';

(function(){

    angular.module('app').controller('addFeedsController', ['$location', 'snugfeedUserService', 'snugfeedFeedsService', addFeedsController]);

    function addFeedsController($location,snugfeedUserService,snugfeedFeedsService) {

        var vm = this;
        vm.feeds = [];
        vm.userFeeds = [];
        vm.loading = false;

        if(snugfeedUserService.getApiToken() == '') {
            $location.path( "/" );
        }

        function searchTerm(term) {
            vm.loading = true;
            snugfeedFeedsService.searchForFeed(term).then(function(resp) {
                vm.feeds = resp.data;
                vm.loading = false;
            });
        }

        function init() {
            snugfeedFeedsService.getFeeds().then(function(resp) {
                vm.feeds = resp.data.data;
            });
        }

        function getUserFeeds() {
            snugfeedUserService.getUserStatus().then(function(resp) {
                vm.userFeeds = resp.data.user.feeds;
            });
        }

        getUserFeeds();
        init();
        $('.tabs.menu .item').tab({
            onLoad: function(tab) {
                if(tab == 'add') {
                    init();
                }
                else {
                    getUserFeeds();
                }
            }
        });

        vm.search = function(term) {
            if(term.length > 3) searchTerm(term);
        };

        vm.add = function($index, feedID) {

            if(vm.feeds[$index].added) return;

            vm.feeds[$index].loading = true;

            snugfeedFeedsService.addFeed({feed_id: feedID}).then(function(resp) {
                vm.feeds[$index].loading = false;
                if(resp.data.status == 'success') {
                    vm.feeds[$index].added = true;
                    vm.feeds[$index].btnText = ' ';
                }

            });
        };

        vm.remove = function($index, feedID) {

            vm.userFeeds[$index].loading = true;

            snugfeedFeedsService.removeFeed(feedID).then(function(resp) {
                vm.userFeeds[$index].loading = false;
                if(resp.data.status == 'success') {
                    vm.userFeeds[$index].removed = true;
                    vm.userFeeds[$index].btnText = 'Removed';
                }
            })
        }

    }

})();