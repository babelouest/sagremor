angular.module('angharadApp')
    .factory('benoicFactory', ['$http', function($http) {

    var urlBase = 'http://localhost:2473/benoic';
    var dataFactory = {};

    dataFactory.getDeviceTypes = function () {
        return $http.get(urlBase + '/deviceTypes/');
    };

    dataFactory.getDeviceList = function () {
        return $http.get(urlBase + '/device/');
    };

    dataFactory.getDevice = function (name) {
        return $http.get(urlBase + '/device/' + name);
    };

    dataFactory.getDeviceOverview = function (name, enabled) {
        return $http.get(urlBase + '/device/' + name + '/overview');
    };

    return dataFactory;
}]);
