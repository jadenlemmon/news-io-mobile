'use strict';

(function(angular) {
    angular.module('snugfeed.service.articles', ['env', 'snugfeed.service.user'])
        .service('snugfeedArticlesService', function($http,snugfeedUserService,__env) {

            var getArticles = function (page,ids) {
                var query = page ? '&start='+page : '';
                ids = '?ids='+ids.join();
                return $http.get(__env.apiUrl+"articles"+ids+query+'&api_token='+snugfeedUserService.getApiToken());
            };

            var saveArticle = function(id) {
                return $http.put("/api/article/"+id);
            };

            var getArticle = function(id) {
                return $http.get("/api/article/"+id);
            };

            var getArticlesByIds = function(ids) {
                return $http.get("/api/articles?article-ids="+ids);
            };

            var getSavedArticles = function() {
                return $http.get("/api/article");
            };

            return {
                getArticles: getArticles,
                saveArticle: saveArticle,
                getSavedArticles: getSavedArticles,
                getArticle: getArticle,
                getArticlesByIds: getArticlesByIds
            };

        });
})(angular);