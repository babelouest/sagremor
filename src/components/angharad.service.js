angular.module('angharadApp')
    .factory('angharadFactory', ['$http', function($http) {

    var urlBase = 'http://localhost:2473/angharad';
    var dataFactory = {};

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
