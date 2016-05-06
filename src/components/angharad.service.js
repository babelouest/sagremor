angular.module('angharadApp')
    .factory('angharadFactory', [
    '$http',
    '$cookies',
    function($http, $cookies) {

        var urlBase = 'https://hunbaut.babelouest.org/angharaddev/angharad';
        //var urlBase = 'http://localhost:2473/angharad';
        var dataFactory = {};
        
        dataFactory.getAuth = function () {
            return $http.get(urlBase + '/auth/');
        };

        dataFactory.postAuth = function (user, password, validity) {
            var data = {
                user: user,
                password: password
            }
            if (!!validity) {
                data.validity = validity
            }
            return $http.post(urlBase + '/auth/', data);
        };

        dataFactory.deleteAuth = function () {
            return $http.delete(urlBase + '/auth/');
        };

        dataFactory.getSumboduleList = function () {
            return $http.get(urlBase + '/submodule/');
        };

        dataFactory.getSubmodule = function (name) {
            return $http.get(urlBase + '/submodule/' + name);
        };

        dataFactory.enableSubmodule = function (name, enabled) {
            return $http.get(urlBase + '/submodule/' + name + '/enable/' + enabled?'1':'0');
        };

        return dataFactory;
}]);
