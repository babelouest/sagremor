angular.module('sagremorApp')
    .factory('carleonFactory', [
    '$http', 
    'angharadConstant',
    'angharadBackendService',
    function($http, angharadConstant, angharadBackendService) {

    var urlBase = angharadConstant.baseUrl + angharadConstant.prefixCarleon;
    var dataFactory = {};

    /* Base Carleon endpoints */
    dataFactory.getServiceList = function () {
        return angharadBackendService.httpRequest("GET", urlBase + '/service');
    };

    dataFactory.enableService = function (service_uid, enable) {
        return angharadBackendService.httpRequest("PUT", urlBase + '/service/' + service_uid + '/enable/' + (enable?'1':'0'));
    };

    dataFactory.elementCleanup = function (service_uid, element) {
        return angharadBackendService.httpRequest("PUT", urlBase + '/service/' + service_uid + '/' + element + '/cleanup');
    };

    dataFactory.elementAddTag = function (service_uid, element, tag) {
        return angharadBackendService.httpRequest("PUT", urlBase + '/service/' + service_uid + '/' + element + '/' + tag);
    };

    dataFactory.elementRemoveTag = function (service_uid, element, tag) {
        return angharadBackendService.httpRequest("DELETE", urlBase + '/service/' + service_uid + '/' + element + '/' + tag);
    };

    /* Profile endpoints */
    dataFactory.getProfileList = function () {
        return angharadBackendService.httpRequest("GET", urlBase + '/profile');
    };

    dataFactory.getProfile = function (profile_id) {
        return angharadBackendService.httpRequest("GET", urlBase + '/profile/' + profile_id);
    };

    dataFactory.setProfile = function (profile_id, profile) {
        return angharadBackendService.httpRequest("PUT", urlBase + '/profile/' + profile_id, profile);
    };

    dataFactory.removeProfile = function (profile_id) {
        return angharadBackendService.httpRequest("DELETE", urlBase + '/profile/' + profile_id);
    };

	/* Mock service */
    dataFactory.getMockList = function () {
        return angharadBackendService.httpRequest("GET", urlBase + 'mock-service/');
    };

    dataFactory.getMock = function (name) {
        return angharadBackendService.httpRequest("GET", urlBase + 'mock-service/' + name);
    };

    dataFactory.addMock = function (mock) {
        return angharadBackendService.httpRequest("POST", urlBase + 'mock-service/', mock);
    };

    dataFactory.setMock = function (name, mock) {
        return angharadBackendService.httpRequest("PUT", urlBase + 'mock-service/' + name, mock);
    };

    dataFactory.removeMock = function (name) {
        return angharadBackendService.httpRequest("DELETE", urlBase + 'mock-service/' + name);
    };

    dataFactory.commandMock = function (name, command, param1, param2, param3) {
        return angharadBackendService.httpRequest("GET", urlBase + 'mock-service/' + name + '/command/' + command + '/' + param1 + '/' + param2 + '/' + param3);
    };

    return dataFactory;
}]);
