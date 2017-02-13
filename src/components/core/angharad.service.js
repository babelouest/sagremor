angular.module("sagremorApp")
	.factory("angharadBackendService",
	function($http, $q, sagremorParams) {
		var angharadBackendFactory = {};
		
		angharadBackendFactory.httpRequest = function (method, url, data, params) {
		  var deferred = $q.defer();
		  
      if (sagremorParams.token && sagremorParams.token.access_token) {
        $http({method: method, url: url, data: data, params: params, headers: {Authorization: 'Bearer ' + sagremorParams.token.access_token}}).then(function (response) {
          deferred.resolve(response.data);
        }, function (error) {
          deferred.reject(error);
        });
      } else {
        deferred.reject("unauthorized");
      }
		  
		  return deferred.promise;
		};
		
		return angharadBackendFactory;
	})
	.factory("angharadFactory", 
	function($http, $q, angharadConfig, angharadBackendService, sagremorParams) {

		var urlBase = angharadConfig.baseUrl + angharadConfig.prefixAngharad;
		var dataFactory = {};
		
		dataFactory.getSumboduleList = function () {
			return angharadBackendService.httpRequest("GET", urlBase + "submodule/");
		};

		dataFactory.getSubmodule = function (name) {
			return angharadBackendService.httpRequest("GET", urlBase + "submodule/" + name);
		};

		dataFactory.enableSubmodule = function (name, enabled) {
			return angharadBackendService.httpRequest("GET", urlBase + "submodule/" + name + "/enable/" + (enabled?"1":"0"));
		};

		dataFactory.getScriptList = function () {
			return angharadBackendService.httpRequest("GET", urlBase + "script/");
		};

		dataFactory.getScript = function (name) {
			return angharadBackendService.httpRequest("GET", urlBase + "script/" + name);
		};

		dataFactory.addScript = function (script) {
			return angharadBackendService.httpRequest("POST", urlBase + "script/", script);
		};

		dataFactory.setScript = function (name, script) {
			return angharadBackendService.httpRequest("PUT", urlBase + "script/" + name, script);
		};

		dataFactory.removeScript = function (name) {
			return angharadBackendService.httpRequest("DELETE", urlBase + "script/" + name);
		};

		dataFactory.runScript = function (name) {
			return angharadBackendService.httpRequest("GET", urlBase + "script/" + name + "/run");
		};

		dataFactory.getSchedulerList = function () {
			return angharadBackendService.httpRequest("GET", urlBase + "scheduler/");
		};

		dataFactory.getScheduler = function (name) {
			return angharadBackendService.httpRequest("GET", urlBase + "scheduler/" + name);
		};

		dataFactory.enableScheduler = function (name, enabled) {
			return angharadBackendService.httpRequest("GET", urlBase + "scheduler/" + name + "/enable/" + (enabled?"1":"0"));
		};

		dataFactory.addScheduler = function (scheduler) {
			return angharadBackendService.httpRequest("POST", urlBase + "scheduler/", scheduler);
		};

		dataFactory.setScheduler = function (name, scheduler) {
			return angharadBackendService.httpRequest("PUT", urlBase + "scheduler/" + name, scheduler);
		};

		dataFactory.removeScheduler = function (name) {
			return angharadBackendService.httpRequest("DELETE", urlBase + "scheduler/" + name);
		};

		dataFactory.getTriggerList = function () {
			return angharadBackendService.httpRequest("GET", urlBase + "trigger/");
		};

		dataFactory.getTrigger = function (name) {
			return angharadBackendService.httpRequest("GET", urlBase + "trigger/" + name);
		};

		dataFactory.enableTrigger = function (name, enabled) {
			return angharadBackendService.httpRequest("GET", urlBase + "trigger/" + name + "/enable/" + (enabled?"1":"0"));
		};

		dataFactory.addTrigger = function (trigger) {
			return angharadBackendService.httpRequest("POST", urlBase + "trigger/", trigger);
		};

		dataFactory.setTrigger = function (name, trigger) {
			return angharadBackendService.httpRequest("PUT", urlBase + "trigger/" + name, trigger);
		};

		dataFactory.removeTrigger = function (name) {
			return angharadBackendService.httpRequest("DELETE", urlBase + "trigger/" + name);
		};

		/* Profile endpoints */
		dataFactory.getProfileList = function () {
		  return angharadBackendService.httpRequest("GET", urlBase + "profile");
		};

		dataFactory.getProfile = function (profile_id) {
		  return angharadBackendService.httpRequest("GET", urlBase + "profile/" + profile_id);
		};

		dataFactory.setProfile = function (profile_id, profile) {
		  return angharadBackendService.httpRequest("PUT", urlBase + "profile/" + profile_id, profile);
		};

		dataFactory.removeProfile = function (profile_id) {
		  return angharadBackendService.httpRequest("DELETE", urlBase + "profile/" + profile_id);
		};
		
		/* Users endpoints */
		dataFactory.getUserList = function () {
			return angharadBackendService.httpRequest("GET", urlBase + "user/");
		};

		dataFactory.addUser = function (user) {
			return angharadBackendService.httpRequest("POST", urlBase + "user/", user);
		};

		dataFactory.setUser = function (name, user) {
			return angharadBackendService.httpRequest("PUT", urlBase + "user/" + name, user);
		};

		dataFactory.removeUser = function (name) {
			return angharadBackendService.httpRequest("DELETE", urlBase + "user/" + name);
		};
		
		/* Token endpoints */
		dataFactory.getTokenList = function (options) {
			return angharadBackendService.httpRequest("GET", urlBase + "token/", null, options);
		};

		dataFactory.revokeToken = function (token) {
			return angharadBackendService.httpRequest("POST", urlBase + "token/", {token: token});
		};

		
		dataFactory.saveCurrentProfile = function () {
			var profile = sagremorParams.currentProfile;
			var deferred = $q.defer();
			if (!!profile) {
				return dataFactory.setProfile(profile.name, profile);
			} else {
				deferred.reject(error);
				return deferred.promise;
			}
		};

		return dataFactory;
	}
);
