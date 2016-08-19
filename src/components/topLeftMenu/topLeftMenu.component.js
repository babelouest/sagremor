function topLeftMenuCtrl ($scope, $translate, sagremorParams, sagGenericInjectorManager, carleonComponentsConfig) {
    var self = this;
    
    this.serviceList = [];
    this.sagremorParams = sagremorParams;
    
    function init() {
		_.forEach(sagGenericInjectorManager.components, function (inject) {
			if (inject.carleonService && inject.leftMenu && !!carleonComponentsConfig[inject.type] && !!carleonComponentsConfig[inject.type].enabled) {
				var menu = inject.leftMenu;
				menu.icon = inject.icon;
				self.serviceList.push(menu);
			}
		});
	}
	
	$scope.$on("submodulesChanged", function () {
		self.sagremorParams = sagremorParams;
	});

    init();
}

angular.module("sagremorApp").component("topLeftMenu", {
    templateUrl: "components/topLeftMenu/topLeftMenu.template.html",
    controller: topLeftMenuCtrl,
    controllerAs: "topLeftMenuCtrl"
});
