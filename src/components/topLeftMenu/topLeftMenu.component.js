function topLeftMenuCtrl ($scope, $translate, sagremorParams, sagGenericInjectorManager) {
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
