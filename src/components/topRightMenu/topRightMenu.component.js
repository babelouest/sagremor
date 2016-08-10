function topRightMenuCtrl ($scope, $rootScope, $location, $http, $translate, $cookies, angharadFactory, sagremorConstant, sagremorParams) {
    var self = this;

    self.sagremorParams = sagremorParams;

    self.selectedLang = $translate.use();

    self.langList = sagremorConstant.langList;
    
    self.profiles = sagremorParams.profiles;
    self.currentProfileName = !!sagremorParams.currentProfile?sagremorParams.currentProfile.name:"";

    self.changeLang = function () {
        $translate.use(self.selectedLang).then(function () {
			$rootScope.$broadcast("changeLang");
		});
    };
    
    self.changeProfile = function () {
		_.forEach(sagremorParams.profiles, function (profile) {
			if (profile.name === self.currentProfileName) {
				sagremorParams.currentProfile = profile;
				var now = new Date();
				var exp = new Date(now.getFullYear()+10, now.getMonth(), now.getDate());
				$cookies.put("ANGHARAD_PROFILE", self.currentProfileName, {expires: exp});
				$rootScope.$broadcast("angharadProfileUpdated");
				$rootScope.$broadcast("refreshDashboard");
			}
		});
	};
	
	self.refresh = function () {
		$rootScope.$broadcast("refresh");
	};
	
    self.logout = function() {
		angharadFactory.deleteAuth()
			.then(function(response) {
			sagremorParams.loggedIn = false;
			$scope.isLogged = false;
			$location.path("/login");
			$http.defaults.headers.common["ANGHARAD_SESSION_ID"] = "";
		});
    };
    
	$scope.$on("angharadProfileChanged", function () {
		self.profiles = sagremorParams.profiles;
		self.currentProfileName = !!sagremorParams.currentProfile?sagremorParams.currentProfile.name:"";
	});
	
	$scope.$on("angharadProfileUpdated", function () {
		self.profiles = sagremorParams.profiles;
		self.currentProfileName = !!sagremorParams.currentProfile?sagremorParams.currentProfile.name:"";
	});

}

angular.module("sagremorApp").component("topRightMenu", {
    templateUrl: "components/topRightMenu/topRightMenu.template.html",
    controller: topRightMenuCtrl,
    controllerAs: "topRightMenuCtrl"
});
