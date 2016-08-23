function topLeftMenuCtrl ($scope, $translate, sagremorParams, sagGenericInjectorManager, carleonComponentsConfig, sharedData) {
    var self = this;
    
    this.serviceList = [];
    this.sagremorParams = sagremorParams;
    
    function init() {
		self.loadMenu();
	}
	
	this.loadMenu = function () {
		self.serviceList = [];
		_.forEach(sagGenericInjectorManager.components, function (inject) {
			var service = sharedData.get("carleonServices", inject.type);
			if (inject.carleonService && inject.leftMenu && !!carleonComponentsConfig[inject.type] && !!carleonComponentsConfig[inject.type].enabled && !!service && service.enabled) {
				var menu = inject.leftMenu;
				menu.icon = inject.icon;
				self.serviceList.push(menu);
			}
		});
	};
	
	$scope.$on("submodulesChanged", function () {
		self.sagremorParams = sagremorParams;
	});
	
	$scope.$on("carleonServicesChanged", function () {
		self.loadMenu();
	});

    init();
}

angular.module("sagremorApp").component("topLeftMenu", {
    templateUrl: "components/topLeftMenu/topLeftMenu.template.html",
    controller: topLeftMenuCtrl,
    controllerAs: "topLeftMenuCtrl"
});
