angular.module("sagremorApp")
    .factory("carleonFactory", 
    function($http, $q, angharadConfig, angharadBackendService, sagremorParams) {

    var urlBase = angharadConfig.baseUrl + angharadConfig.prefixCarleon;
    var dataFactory = {};

    /* Base Carleon endpoints */
    dataFactory.getServiceList = function () {
        return angharadBackendService.httpRequest("GET", urlBase + "service");
    };

    dataFactory.enableService = function (service_name, enable) {
        return angharadBackendService.httpRequest("PUT", urlBase + "service/" + service_name + "/enable/" + (enable?"1":"0"));
    };

    dataFactory.elementCleanup = function (service_name, element) {
        return angharadBackendService.httpRequest("PUT", urlBase + "service/" + service_name + "/" + element + "/cleanup");
    };

    dataFactory.addTag = function (service_name, element, tag) {
        return angharadBackendService.httpRequest("PUT", urlBase + "service/" + service_name + "/" + element + "/" + tag);
    };

    dataFactory.removeTag = function (service_name, element, tag) {
        return angharadBackendService.httpRequest("DELETE", urlBase + "service/" + service_name + "/" + element + "/" + tag);
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
});
