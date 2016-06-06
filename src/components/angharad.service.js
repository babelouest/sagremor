angular.module('sagremorApp')
    .factory('angharadBackendService', [
    '$http',
    '$q',
    function($http, $q) {
        var angharadBackendFactory = {};
        
        angharadBackendFactory.httpRequest = function (method, url, data, params) {
          var deferred = $q.defer();
          
          $http({method: method, url: url, data: data, params: params}).then(function (response) {
            deferred.resolve(response.data);
          }, function (error) {
            deferred.reject(error);
          });
          
          return deferred.promise;
        };
        
        return angharadBackendFactory;
    }])
    .factory('angharadFactory', 
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
            return angharadBackendService.httpRequest("GET", urlBase + 'submodule/' + name + '/enable/' + (enabled?'1':'0'));
        };

        dataFactory.getScriptList = function () {
            return angharadBackendService.httpRequest("GET", urlBase + 'script/');
        };

        dataFactory.getScript = function (name) {
            return angharadBackendService.httpRequest("GET", urlBase + 'script/' + name);
        };

        dataFactory.addScript = function (script) {
            return angharadBackendService.httpRequest("POST", urlBase + 'script/', script);
        };

        dataFactory.setScript = function (name, script) {
            return angharadBackendService.httpRequest("GET", urlBase + 'script/' + name, script);
        };

        dataFactory.removeScript = function () {
            return angharadBackendService.httpRequest("GET", urlBase + 'script/');
        };

        dataFactory.runScript = function (name) {
            return angharadBackendService.httpRequest("GET", urlBase + 'script/' + name + '/run');
        };

        dataFactory.getSchedulerList = function () {
            return angharadBackendService.httpRequest("GET", urlBase + 'scheduler/');
        };

        dataFactory.getScheduler = function (name) {
            return angharadBackendService.httpRequest("GET", urlBase + 'scheduler/' + name);
        };

        dataFactory.addScheduler = function (scheduler) {
            return angharadBackendService.httpRequest("POST", urlBase + 'scheduler/', scheduler);
        };

        dataFactory.setScheduler = function (name, scheduler) {
            return angharadBackendService.httpRequest("GET", urlBase + 'scheduler/' + name, scheduler);
        };

        dataFactory.removeScheduler = function () {
            return angharadBackendService.httpRequest("GET", urlBase + 'scheduler/');
        };

        dataFactory.getTriggerList = function () {
            return angharadBackendService.httpRequest("GET", urlBase + 'trigger/');
        };

        dataFactory.getTrigger = function (name) {
            return angharadBackendService.httpRequest("GET", urlBase + 'trigger/' + name);
        };

        dataFactory.addTrigger = function (trigger) {
            return angharadBackendService.httpRequest("POST", urlBase + 'trigger/', trigger);
        };

        dataFactory.setTrigger = function (name, trigger) {
            return angharadBackendService.httpRequest("GET", urlBase + 'trigger/' + name, trigger);
        };

        dataFactory.removeTrigger = function () {
            return angharadBackendService.httpRequest("GET", urlBase + 'trigger/');
        };

        return dataFactory;
    }
);
