angular.module("sagremorApp")
    .controller("serviceCtrl",
    function($scope, $stateParams, $location, $translate, $uibModal, toaster, sagGenericInjectorManager, sagremorService, carleonFactory, sharedData, sagremorParams) {
      
        var self = this;
        
        this.sagremorParams = sagremorParams;
        this.serviceGroup = {};
        this.currentInjector = _.find(sagGenericInjectorManager.components, function (component) {
			return component.leftMenu && component.leftMenu.target === $stateParams.service;
		});
		this.size = 1;
        
        this.init = function () {
			if (!sagremorParams.loggedIn) {
				$location.path("/login");
			}
			
			self.size = self.currentInjector.size || 1
			$translate(["edit", "remove", "add_to_dashboard"]).then(function (results) {
				self.menu = [
					{
						name: "edit", 
						display: results.edit, 
						action: function (param) {
							param.service.editService(param);
						}
					},
					{
						name: "remove", 
						display: results.remove, 
						action: function (param) {
							param.service.removeService(param).then(function () {
								$scope.$broadcast("carleonServicesChanged");
							});
						}
					},
					{
						name: "add_to_dashboard", 
						display: results.add_to_dashboard, 
						action: function (param) {
							if (sagremorService.addToDashboard(param)) {
                                $scope.$broadcast("refreshDashboard");
                            }
						}
					}
				];
			});
			self.title = self.currentInjector.leftMenu.title;
			self.serviceGroup = {title: self.currentInjector.groupTitle, list: [], service: self.currentInjector.service};
			loadServices();
		};
		
		function loadServices () {
			var serviceList = [];
			var service = sharedData.get("carleonServices", self.currentInjector.type);
			if (!!service && !!service.element) {
				_.forEach(service.element, function (element) {
					var exist = _.find(self.serviceGroup.list, function (elt) {
						return elt.name === element.name;
					});
					if (!exist) {
						var elt = {name: element.name, type: element.type, description: element.description, service: self.currentInjector.service};
						self.serviceGroup.list.push(elt);
					}
				});
				
				_.forEach(self.serviceGroup.list, function (elt, index) {
					var exist = _.find(service.element, function (serviceElt) {
						return serviceElt.name === elt.name;
					});
					if (!exist) {
						self.serviceGroup.list.splice(index, 1);
					}
				});
			}
		}
		
		function refreshServices () {
			var service = sharedData.get("carleonServices", self.currentInjector.type);
			if (!!service && !!service.element) {
				_.forEach(service.element, function (element) {
					var exist = _.find(self.serviceGroup.list, function (elt) {
						return elt.name === element.name;
					});
					if (!exist) {
						var elt = {name: element.name, type: element.type, description: element.description, service: self.currentInjector.service};
						self.serviceGroup.list.push(elt);
					}
				});
				
				_.forEach(self.serviceGroup.list, function (elt, index) {
					var exist = _.find(service.element, function (serviceElt) {
						return serviceElt.name === elt.name;
					});
					if (!exist) {
						self.serviceGroup.list.splice(index, 1);
					}
				});
			}
		}
		
		this.addService = function (service) {
			service.addService();
		};
		
		$scope.$on("carleonServicesChanged", function () {
			loadServices();
		});
        
		$scope.$on("refreshCarleonServices", function () {
			refreshServices();
		});
	
        this.init();
        
    }
);
