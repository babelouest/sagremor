function topLeftMenuCtrl ($scope, $location, $http, $translate, angharadFactory, sagremorParams, sagGenericInjectorManager) {
    var self = this;
    
    this.serviceList = [];
    this.sagremorParams = sagremorParams;
    
    function init() {
		_.forEach(sagGenericInjectorManager.components, function (service) {
			if (service.leftMenu) {
				self.serviceList.push(service.leftMenu);
			}
		});
	}

    self.logout = function() {
		angharadFactory.deleteAuth()
			.then(function(response) {
			sagremorParams.loggedIn = false;
			$scope.isLogged = false;
			$location.path("/login");
			$http.defaults.headers.common["ANGHARAD_SESSION_ID"] = "";
		});
    };
    
    init();
}

angular.module('sagremorApp').component('topLeftMenu', {
    templateUrl: 'components/topLeftMenu/topLeftMenu.template.html',
    controller: topLeftMenuCtrl,
    controllerAs: 'topLeftMenuCtrl'
});
