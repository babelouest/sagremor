angular.module('sagremorApp')
    .factory('angharadBackendService', [
    '$http',
    '$q',
    function($http, $q) {
        var angharadBackendFactory = {};
        
        angharadBackendFactory.httpRequest = function (method, url, data) {
          var deferred = $q.defer();
          
          $http({method: method, url: url, data: data}).then(function (response) {
            deferred.resolve(response.data);
          }, function (error) {
            deferred.reject(error);
          });
          
          return deferred.promise;
        };
        
        return angharadBackendFactory;
    }])
    .factory('angharadFactory', [
    '$http',
    'angharadConstant',
    'angharadBackendService',
    function($http, angharadConstant, angharadBackendService) {

        var urlBase = angharadConstant.baseUrl + angharadConstant.prefixAngharad;
        var dataFactory = {};
        
        dataFactory.getAuth = function () {
            return angharadBackendService.httpRequest("GET", urlBase + 'auth/');
        };

        dataFactory.postAuth = function (user, password, validity) {
            var data = {
                user: user,
                password: password
            }
            if (!!validity) {
                data.validity = validity
            }
            return angharadBackendService.httpRequest("POST", urlBase + 'auth/', data);
        };

        dataFactory.deleteAuth = function () {
            return angharadBackendService.httpRequest("DELETE", urlBase + 'auth/');
        };

        dataFactory.getSumboduleList = function () {
            return angharadBackendService.httpRequest("GET", urlBase + 'submodule/');
        };

        dataFactory.getSubmodule = function (name) {
            return angharadBackendService.httpRequest("GET", urlBase + 'submodule/' + name);
        };

        dataFactory.enableSubmodule = function (name, enabled) {
            return angharadBackendService.httpRequest("GET", urlBase + 'submodule/' + name + '/enable/' + enabled?'1':'0');
        };

        return dataFactory;
}]);
