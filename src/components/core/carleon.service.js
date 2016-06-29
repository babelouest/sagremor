angular.module("sagremorApp")
    .factory("carleonFactory", 
    function($http, angharadConfig, angharadBackendService) {

    var urlBase = angharadConfig.baseUrl + angharadConfig.prefixCarleon;
    var dataFactory = {};

    /* Base Carleon endpoints */
    dataFactory.getServiceList = function () {
        return angharadBackendService.httpRequest("GET", urlBase + "service");
    };

    dataFactory.enableService = function (service_uid, enable) {
        return angharadBackendService.httpRequest("PUT", urlBase + "service/" + service_uid + "/enable/" + (enable?"1":"0"));
    };

    dataFactory.elementCleanup = function (service_uid, element) {
        return angharadBackendService.httpRequest("PUT", urlBase + "service/" + service_uid + "/" + element + "/cleanup");
    };

    dataFactory.addTag = function (service_uid, element, tag) {
        return angharadBackendService.httpRequest("PUT", urlBase + "service/" + service_uid + "/" + element + "/" + tag);
    };

    dataFactory.removeTag = function (service_uid, element, tag) {
        return angharadBackendService.httpRequest("DELETE", urlBase + "service/" + service_uid + "/" + element + "/" + tag);
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

    return dataFactory;
});
