function topRightMenuCtrl ($scope, $translate, sagremorParams) {
    var self = this;

    self.sagremorParams = sagremorParams;

    self.selectedLang = $translate.use();

    self.langList = [
        {name: "fr", display: "Fr"},
        {name: "en", display: "En"}
    ];
    
    self.profiles = sagremorParams.profiles;
    self.currentProfileName = !!sagremorParams.currentProfile?sagremorParams.currentProfile.name:"";

    self.changeLang = function () {
        $translate.use(self.selectedLang);
    };
    
    self.changeProfile = function () {
		_.forEach(sagremorParams.profiles, function (profile) {
			if (profile.name === self.currentProfileName) {
				sagremorParams.currentProfile = profile;
			}
		});
	};
	
	$scope.$on('carleonProfilesChanged', function () {
		self.profiles = sagremorParams.profiles;
		self.currentProfileName = !!sagremorParams.currentProfile?sagremorParams.currentProfile.name:"";
	});

}

angular.module('sagremorApp').component('topRightMenu', {
    templateUrl: 'components/topRightMenu/topRightMenu.template.html',
    controller: topRightMenuCtrl,
    controllerAs: 'topRightMenuCtrl'
});
