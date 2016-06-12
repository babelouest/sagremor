function topLeftMenuCtrl ($scope, $location, $http, $translate, angharadFactory, sagremorParams) {
    var self = this;


    self.logout = function() {
		angharadFactory.deleteAuth()
			.then(function(response) {
			$scope.isLogged = false;
			$location.path("/login");
			$http.defaults.headers.common["ANGHARAD_SESSION_ID"] = "";
		});
    };
    
}

angular.module('sagremorApp').component('topLeftMenu', {
    templateUrl: 'components/topLeftMenu/topLeftMenu.template.html',
    controller: topLeftMenuCtrl,
    controllerAs: 'topLeftMenuCtrl'
});
