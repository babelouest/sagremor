function topRightMenuCtrl ($scope, $rootScope, $translate, $cookieStore, sagremorConstant, sagremorParams) {
    var self = this;

    self.sagremorParams = sagremorParams;

    self.selectedLang = $translate.use();

    self.langList = sagremorConstant.langList;
    
    self.profiles = sagremorParams.profiles;
    self.currentProfileName = !!sagremorParams.currentProfile?sagremorParams.currentProfile.name:"";

    self.changeLang = function () {
        $translate.use(self.selectedLang);
    };
    
    self.changeProfile = function () {
		_.forEach(sagremorParams.profiles, function (profile) {
			if (profile.name === self.currentProfileName) {
				sagremorParams.currentProfile = profile;
				$cookieStore.put("ANGHARAD_PROFILE", self.currentProfileName);
				$rootScope.$broadcast('carleonProfileUpdated');
			}
		});
	};
	
	$scope.$on('carleonProfilesChanged', function () {
		self.profiles = sagremorParams.profiles;
		self.currentProfileName = !!sagremorParams.currentProfile?sagremorParams.currentProfile.name:"";
	});
	
	$scope.$on('carleonProfileUpdated', function () {
		self.profiles = sagremorParams.profiles;
		self.currentProfileName = !!sagremorParams.currentProfile?sagremorParams.currentProfile.name:"";
	});

}

angular.module('sagremorApp').component('topRightMenu', {
    templateUrl: 'components/topRightMenu/topRightMenu.template.html',
    controller: topRightMenuCtrl,
    controllerAs: 'topRightMenuCtrl'
});
